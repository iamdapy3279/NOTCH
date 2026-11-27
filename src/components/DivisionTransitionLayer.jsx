import React, { useEffect, useRef, useState } from 'react';
import { DIVISIONS } from '../config/divisions';
import { preloadDivisionAssets, warmBackgroundAssets } from '../utils/assetPreloader';

/**
 * Shared branded transition & asset-preloading layer used by both Notch divisions.
 * Supports:
 * 1. Spatial card expansion from an exact bounding rect (`fromRect`) on `/`
 * 2. Direct URL load / browser refresh (`fromRect === null`) on `/homepage-2` or `/hygiene`
 * 3. Real weighted asset preloading before revealing the destination page
 */
export default function DivisionTransitionLayer({
  divisionId,
  fromRect,
  onNavigateReady,
  onComplete,
}) {
  const division = DIVISIONS[divisionId];
  const isSpatial = Boolean(fromRect);

  const [isExpanded, setIsExpanded] = useState(!isSpatial);
  const [showLoaderChrome, setShowLoaderChrome] = useState(!isSpatial);
  const [actualPercent, setActualPercent] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [statusText, setStatusText] = useState('Preparing experience…');
  const [isFadingOut, setIsFadingOut] = useState(false);

  const actualPercentRef = useRef(0);
  const displayPercentRef = useRef(0);
  const expansionDoneRef = useRef(!isSpatial);
  const assetsDoneRef = useRef(false);
  const revealTriggeredRef = useRef(false);

  // 1. Trigger spatial card expansion on mount when coming from SplitLandingPage
  useEffect(() => {
    if (!isSpatial) return undefined;

    let raf1 = 0;
    let raf2 = 0;
    let chromeTimer = 0;
    let expandDoneTimer = 0;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setIsExpanded(true);
      });
    });

    // Bring in progress bar chrome smoothly as the card nears full viewport
    chromeTimer = setTimeout(() => {
      setShowLoaderChrome(true);
    }, 340);

    expandDoneTimer = setTimeout(() => {
      expansionDoneRef.current = true;
    }, 640);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(chromeTimer);
      clearTimeout(expandDoneTimer);
    };
  }, [isSpatial]);

  // 2. Run actual asset preloader for the selected division immediately
  useEffect(() => {
    if (!divisionId || !division) return undefined;

    const controller = new AbortController();
    assetsDoneRef.current = false;
    actualPercentRef.current = 0;
    setActualPercent(0);

    preloadDivisionAssets(divisionId, {
      signal: controller.signal,
      onProgress: ({ percent, status }) => {
        if (controller.signal.aborted) return;
        actualPercentRef.current = percent;
        setActualPercent(percent);
        if (status) setStatusText(status);
      },
    }).then(() => {
      if (controller.signal.aborted) return;
      actualPercentRef.current = 100;
      setActualPercent(100);
      setStatusText('Ready');
      assetsDoneRef.current = true;
    });

    return () => controller.abort();
  }, [divisionId, division]);

  // 3. Smooth visual progress interpolation (strictly capped at real actualPercent)
  // Ensures zero jumpiness while NEVER advancing beyond genuine loaded progress.
  useEffect(() => {
    if (!division) return undefined;

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min(50, now - lastTime);
      lastTime = now;

      const target = actualPercentRef.current;
      const current = displayPercentRef.current;

      if (current < target) {
        // Responsive catch-up toward real progress without faking ahead
        const step = Math.max(0.45, (target - current) * 0.16) * (dt / 16.67);
        const next = Math.min(target, current + step);
        displayPercentRef.current = next;
        setDisplayPercent(Math.round(next));
      }

      const readyToReveal =
        !revealTriggeredRef.current &&
        assetsDoneRef.current &&
        expansionDoneRef.current &&
        Math.round(displayPercentRef.current) >= 100;

      if (readyToReveal) {
        revealTriggeredRef.current = true;
        // Mount destination page underneath while overlay stays completely opaque
        onNavigateReady?.(division.route);

        // Wait until the visible hero <video> (if any) is actively playing or decoded
        // behind the opaque loader before fading out — guarantees zero flash or delay.
        const startFadeOut = () => {
          if (revealTriggeredRef.current === 'fading') return;
          revealTriggeredRef.current = 'fading';
          setIsFadingOut(true);
          if (division.backgroundAssets?.length) {
            warmBackgroundAssets(division.backgroundAssets);
          }
          setTimeout(() => {
            onComplete?.();
          }, 520);
        };

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const heroVideos = Array.from(
              document.querySelectorAll('video[data-hero-video="true"]')
            ).filter((v) => v.offsetParent !== null || getComputedStyle(v).display !== 'none');

            const activeHero = heroVideos[0];
            if (!activeHero) {
              startFadeOut();
              return;
            }

            activeHero.muted = true;
            activeHero.play().catch(() => {});

            if (!activeHero.paused && activeHero.readyState >= 3) {
              startFadeOut();
              return;
            }

            const safetyTimer = setTimeout(startFadeOut, 450);
            const onPlaying = () => {
              clearTimeout(safetyTimer);
              requestAnimationFrame(startFadeOut);
            };
            activeHero.addEventListener('playing', onPlaying, { once: true });
            activeHero.addEventListener('canplay', onPlaying, { once: true });
          });
        });
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [division, onNavigateReady, onComplete]);

  if (!division) return null;

  const { theme } = division;

  const containerStyle = isSpatial && !isExpanded
    ? {
        top: `${fromRect.top}px`,
        left: `${fromRect.left}px`,
        width: `${fromRect.width}px`,
        height: `${fromRect.height}px`,
        borderRadius: '0px',
        backgroundColor: theme.bgHex,
      }
    : {
        top: '0px',
        left: '0px',
        width: '100vw',
        height: '100dvh',
        borderRadius: '0px',
        backgroundColor: theme.bgHex,
      };

  return (
    <div
      role="progressbar"
      aria-label={`Loading ${division.name}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={displayPercent}
      style={containerStyle}
      className={`fixed z-[100] overflow-hidden flex flex-col items-center justify-center select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Apply smooth spatial & opacity transitions */}
      <style>{`
        @keyframes notch-pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
      `}</style>
      {/* Subtle background image on Hygiene loader (no green tint) */}
      {divisionId === 'hygiene' && division.previewImage && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <img
            src={division.previewImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 0%, rgba(234,238,241,0.65) 100%)',
            }}
          />
        </div>
      )}

      {/* Concentric Subtle Brand Ring Motif */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-35">
        <div
          className="w-[460px] h-[460px] sm:w-[680px] sm:h-[680px] rounded-full border transition-transform duration-700 ease-out"
          style={{
            borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(25,36,28,0.08)',
            transform: isExpanded ? 'scale(1)' : 'scale(0.8)',
          }}
        />
        <div
          className="absolute w-[640px] h-[640px] sm:w-[960px] sm:h-[960px] rounded-full border transition-transform duration-700 ease-out"
          style={{
            borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(25,36,28,0.05)',
            transform: isExpanded ? 'scale(1)' : 'scale(0.72)',
          }}
        />
      </div>

      {/* Main Centered Division Brand & Loading Progress */}
      <div
        className="relative z-10 flex flex-col items-center px-6 text-center max-w-md w-full"
        style={{
          transition: 'transform 620ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Existing NOTCH Division Logo */}
        <img
          src={division.logo}
          alt={division.name}
          className="h-14 sm:h-16 md:h-[72px] w-auto object-contain"
          style={{
            animation: showLoaderChrome && !isFadingOut ? 'notch-pulse-subtle 2.8s ease-in-out infinite' : 'none',
          }}
        />

        {/* Division Descriptor */}
        <span
          className="mt-4 text-[11px] sm:text-xs font-bold uppercase tracking-[0.34em] font-['Outfit']"
          style={{ color: theme.accent }}
        >
          {division.shortLabel}
        </span>

        {/* Branded Loading Progress Bar & Percentage */}
        <div
          className={`w-full max-w-[290px] sm:max-w-[330px] mt-10 transition-all duration-500 ease-out ${
            showLoaderChrome ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {/* Horizontal Progress Bar Track */}
          <div
            className="w-full h-[3px] rounded-full overflow-hidden"
            style={{ backgroundColor: theme.barTrack }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-150 ease-out"
              style={{
                width: `${displayPercent}%`,
                backgroundColor: theme.barFill,
              }}
            />
          </div>

          {/* Status & Percentage Readout */}
          <div className="mt-3.5 flex items-center justify-between text-xs font-['Plus_Jakarta_Sans']">
            <span
              className="font-medium truncate pr-3"
              style={{ color: theme.textSecondary }}
            >
              {statusText}
            </span>
            <span
              className="font-semibold tabular-nums shrink-0"
              style={{ color: theme.textPrimary }}
            >
              {displayPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Smooth Transition Styles applied to root fixed container */}
      <style>{`
        [role="progressbar"] {
          transition:
            top 620ms cubic-bezier(0.22, 1, 0.36, 1),
            left 620ms cubic-bezier(0.22, 1, 0.36, 1),
            width 620ms cubic-bezier(0.22, 1, 0.36, 1),
            height 620ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 500ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: top, left, width, height, opacity;
        }
      `}</style>
    </div>
  );
}
