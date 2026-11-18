import { DIVISIONS } from '../config/divisions';

const preloadedDivisions = new Set();

export function isDivisionPreloaded(divisionId) {
  return preloadedDivisions.has(divisionId);
}

/**
 * Preload a single image off the main thread and decode it into the GPU/image cache.
 * Always resolves (even on failure or timeout) so slow/broken assets degrade gracefully.
 */
function preloadImage(url, { timeoutMs = 12000, signal } = {}) {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve({ url, ok: false, aborted: true });
      return;
    }

    const img = new Image();
    img.decoding = 'async';
    let settled = false;

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
      signal?.removeEventListener('abort', onAbort);
      clearTimeout(timer);
    };

    const finish = (ok) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ url, ok });
    };

    const onAbort = () => {
      img.src = '';
      finish(false);
    };

    const timer = setTimeout(() => finish(false), timeoutMs);
    signal?.addEventListener('abort', onAbort, { once: true });

    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(() => finish(true)).catch(() => finish(true));
      } else {
        finish(true);
      }
    };
    img.onerror = () => finish(false);
    img.src = url;
  });
}

/**
 * Preload essential fonts non-blockingly with a short safety timeout for offline/slow networks.
 */
function preloadFonts(fontSpecs = [], { timeoutMs = 4000, signal } = {}) {
  return new Promise((resolve) => {
    if (!document.fonts || signal?.aborted) {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };

    const timer = setTimeout(finish, timeoutMs);

    Promise.allSettled([
      document.fonts.ready,
      ...fontSpecs.map((spec) => document.fonts.load(spec)),
    ]).finally(finish);
  });
}

/**
 * Fetch JSON/data with streaming byte progress if Content-Length is known.
 */
async function preloadDataUrl(url, onFraction, { timeoutMs = 8000, signal } = {}) {
  const controller = new AbortController();
  const onParentAbort = () => controller.abort();
  signal?.addEventListener('abort', onParentAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      onFraction(1);
      return false;
    }

    const total = Number(res.headers.get('content-length')) || 0;
    if (res.body && total > 0) {
      const reader = res.body.getReader();
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value?.byteLength || 0;
        onFraction(Math.min(0.95, received / total));
      }
    } else {
      await res.text();
    }
    onFraction(1);
    return true;
  } catch {
    onFraction(1);
    return false;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onParentAbort);
  }
}

/**
 * Preload a video element using muted + playsInline + preload="auto",
 * reporting genuine buffered fraction via `progress` / `loadeddata` / `canplaythrough`.
 * Downloads through the native media pipeline once (no duplicate XHR download)
 * and respects browser autoplay policies (never plays unmuted audio).
 */
function preloadVideo(url, onFraction, { timeoutMs = 15000, signal } = {}) {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve({ url, ok: false, aborted: true });
      return;
    }

    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.style.cssText =
      'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px;';

    let settled = false;
    let highestFraction = 0;

    const updateFraction = (val) => {
      const clamped = Math.max(highestFraction, Math.min(1, val));
      if (clamped > highestFraction) {
        highestFraction = clamped;
        onFraction(clamped);
      }
    };

    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('canplaythrough', onCanPlayThrough);
      video.removeEventListener('error', onError);
      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
        if (video.parentNode) video.parentNode.removeChild(video);
      } catch {
        // Ignore cleanup errors
      }
    };

    const finish = (ok) => {
      if (settled) return;
      settled = true;
      updateFraction(1);
      cleanup();
      resolve({ url, ok });
    };

    const onAbort = () => finish(false);

    const readBufferedRatio = () => {
      if (!video.duration || !Number.isFinite(video.duration) || video.duration <= 0) {
        return highestFraction;
      }
      if (video.buffered && video.buffered.length > 0) {
        const end = video.buffered.end(video.buffered.length - 1);
        return Math.min(0.98, end / video.duration);
      }
      return highestFraction;
    };

    const onMetadata = () => {
      updateFraction(Math.max(0.15, readBufferedRatio()));
    };

    const onLoadedData = () => {
      updateFraction(Math.max(0.45, readBufferedRatio()));
    };

    const onProgress = () => {
      const ratio = readBufferedRatio();
      updateFraction(ratio);
      if (ratio >= 0.92 && video.readyState >= 3) {
        finish(true);
      }
    };

    const onCanPlay = () => {
      updateFraction(Math.max(0.75, readBufferedRatio()));
    };

    const onCanPlayThrough = () => {
      finish(true);
    };

    const onError = () => {
      finish(false);
    };

    const timer = setTimeout(() => {
      // Slow-network graceful cap: reveal page once initial data or timeout completes
      finish(video.readyState >= 2);
    }, timeoutMs);

    signal?.addEventListener('abort', onAbort, { once: true });
    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('progress', onProgress);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('canplaythrough', onCanPlayThrough);
    video.addEventListener('error', onError);

    document.body.appendChild(video);
    video.src = url;
    video.load();
  });
}

/**
 * Bounded async worker pool so we don't overwhelm slow connections or block main thread.
 */
async function runWithConcurrency(items, concurrency, worker, signal) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      if (signal?.aborted) return;
      const idx = cursor++;
      await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
}

/**
 * Preload all essential resources for a given division ('tableware' | 'hygiene').
 * Reports weighted real-time progress without artificial timers.
 */
export async function preloadDivisionAssets(divisionId, { onProgress, signal } = {}) {
  const division = DIVISIONS[divisionId];
  if (!division) {
    onProgress?.({ percent: 100, status: 'Ready' });
    return;
  }

  // Build weighted task list
  const tasks = [];

  if (division.moduleLoader) {
    tasks.push({ key: 'module', weight: 12, label: 'Loading interface…', fraction: 0 });
  }
  if (division.fonts?.length) {
    tasks.push({ key: 'fonts', weight: 8, label: 'Loading typography…', fraction: 0 });
  }
  (division.dataUrls || []).forEach((item, i) => {
    tasks.push({ key: `data-${i}`, weight: item.weight, label: 'Preparing catalog data…', fraction: 0, item });
  });
  (division.assets || []).forEach((item, i) => {
    tasks.push({ key: `img-${i}`, weight: item.weight, label: 'Loading visual assets…', fraction: 0, item });
  });
  (division.videos || []).forEach((item, i) => {
    tasks.push({ key: `vid-${i}`, weight: item.weight, label: 'Buffering hero media…', fraction: 0, item });
  });

  const totalWeight = tasks.reduce((sum, t) => sum + t.weight, 0) || 1;
  let currentLabel = 'Initializing…';

  const emitProgress = () => {
    if (signal?.aborted) return;
    const loadedWeight = tasks.reduce((sum, t) => sum + t.weight * t.fraction, 0);
    const percent = Math.min(100, Math.round((loadedWeight / totalWeight) * 100));
    onProgress?.({
      percent,
      loadedWeight,
      totalWeight,
      status: percent >= 100 ? 'Ready' : currentLabel,
    });
  };

  emitProgress();

  // Group 1: Module chunk + Fonts + Data + Videos in parallel with images
  const parallelTopLevel = [];

  const moduleTask = tasks.find((t) => t.key === 'module');
  if (moduleTask) {
    parallelTopLevel.push(
      division
        .moduleLoader()
        .catch(() => null)
        .finally(() => {
          moduleTask.fraction = 1;
          currentLabel = moduleTask.label;
          emitProgress();
        })
    );
  }

  const fontTask = tasks.find((t) => t.key === 'fonts');
  if (fontTask) {
    parallelTopLevel.push(
      preloadFonts(division.fonts, { signal }).then(() => {
        fontTask.fraction = 1;
        currentLabel = fontTask.label;
        emitProgress();
      })
    );
  }

  tasks
    .filter((t) => t.key.startsWith('data-'))
    .forEach((task) => {
      parallelTopLevel.push(
        preloadDataUrl(
          task.item.url,
          (frac) => {
            task.fraction = frac;
            currentLabel = task.label;
            emitProgress();
          },
          { signal }
        )
      );
    });

  tasks
    .filter((t) => t.key.startsWith('vid-'))
    .forEach((task) => {
      parallelTopLevel.push(
        preloadVideo(
          task.item.url,
          (frac) => {
            task.fraction = frac;
            currentLabel = task.label;
            emitProgress();
          },
          { signal }
        )
      );
    });

  const imageTasks = tasks.filter((t) => t.key.startsWith('img-'));
  const imagesPromise = runWithConcurrency(
    imageTasks,
    5,
    async (task) => {
      if (signal?.aborted) return;
      await preloadImage(task.item.url, { signal });
      task.fraction = 1;
      currentLabel = task.label;
      emitProgress();
    },
    signal
  );

  await Promise.all([...parallelTopLevel, imagesPromise]);

  if (!signal?.aborted) {
    tasks.forEach((t) => {
      t.fraction = 1;
    });
    preloadedDivisions.add(divisionId);
    emitProgress();
  }
}

/**
 * Low-priority background warming after the destination page has already revealed,
 * so lower-fold carousel slides are ready without delaying first paint.
 */
export function warmBackgroundAssets(urls = []) {
  if (!urls.length) return;
  const startWarming = () => {
    runWithConcurrency(urls, 2, (url) => preloadImage(url, { timeoutMs: 10000 }));
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(startWarming, { timeout: 2500 });
  } else {
    setTimeout(startWarming, 600);
  }
}
