import { DIVISIONS } from '../config/divisions';

const preloadedDivisions = new Set();
const preloadedVideoBlobs = new Map();

export function isDivisionPreloaded(divisionId) {
  return preloadedDivisions.has(divisionId);
}

/**
 * Return an in-memory Blob objectURL if the video was preloaded into RAM,
 * otherwise fall back to the original network URL.
 */
export function getPreloadedVideoSrc(url) {
  return preloadedVideoBlobs.get(url) || url;
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
 * Preload a video completely into an in-memory Blob URL and warm its hardware
 * video decoder before resolving. When the destination <video> mounts with
 * `getPreloadedVideoSrc(url)`, it reads straight from RAM with zero network or
 * range-request delay and starts playing on frame 1.
 */
async function preloadVideo(url, onFraction, { timeoutMs = 20000, signal } = {}) {
  if (signal?.aborted) {
    return { url, ok: false, aborted: true };
  }

  if (preloadedVideoBlobs.has(url)) {
    onFraction(1);
    return { url, ok: true, blobUrl: preloadedVideoBlobs.get(url) };
  }

  const controller = new AbortController();
  const onParentAbort = () => controller.abort();
  signal?.addEventListener('abort', onParentAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let highestFraction = 0;
  const emit = (val) => {
    const clamped = Math.max(highestFraction, Math.min(1, val));
    if (clamped > highestFraction) {
      highestFraction = clamped;
      onFraction(clamped);
    }
  };

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      emit(1);
      return { url, ok: false };
    }

    const total = Number(res.headers.get('content-length')) || 0;
    let blob;

    if (res.body && total > 0) {
      const reader = res.body.getReader();
      const chunks = [];
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value?.byteLength || 0;
        emit(Math.min(0.88, (received / total) * 0.88));
      }
      blob = new Blob(chunks, { type: 'video/mp4' });
    } else {
      blob = await res.blob();
      emit(0.88);
    }

    const blobUrl = URL.createObjectURL(blob);
    preloadedVideoBlobs.set(url, blobUrl);

    // Warm the browser's video decoder on the in-memory Blob URL so first frame is decoded
    await new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.style.cssText =
        'position:fixed;width:2px;height:2px;opacity:0;pointer-events:none;left:0;top:0;z-index:-1;';

      let done = false;
      const finishDecode = () => {
        if (done) return;
        done = true;
        clearTimeout(decodeTimer);
        try {
          video.pause();
          if (video.parentNode) video.parentNode.removeChild(video);
        } catch {
          // ignore
        }
        resolve();
      };

      const decodeTimer = setTimeout(finishDecode, 1500);
      video.addEventListener('canplaythrough', finishDecode, { once: true });
      video.addEventListener('loadeddata', () => {
        video.play().then(finishDecode).catch(finishDecode);
      }, { once: true });
      video.addEventListener('error', finishDecode, { once: true });

      document.body.appendChild(video);
      video.src = blobUrl;
      video.load();
    });

    emit(1);
    return { url, ok: true, blobUrl };
  } catch {
    emit(1);
    return { url, ok: false };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onParentAbort);
  }
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
    if (item.media && typeof window !== 'undefined' && window.matchMedia && !window.matchMedia(item.media).matches) {
      return;
    }
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
