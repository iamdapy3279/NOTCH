import React, { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { DIVISIONS } from '../config/divisions';

export default function SplitLandingPage({ onSelectDivision }) {
  const [activeSelection, setActiveSelection] = useState(null);
  const [hoveredDivision, setHoveredDivision] = useState(null);

  const tablewareRef = useRef(null);
  const hygieneRef = useRef(null);

  const handleSelect = (divisionId) => {
    if (activeSelection) return;
    const ref = divisionId === 'tableware' ? tablewareRef : hygieneRef;
    const rect = ref.current?.getBoundingClientRect();
    setActiveSelection(divisionId);
    onSelectDivision?.(divisionId, rect || null);
  };

  const renderCard = (divisionId, ref) => {
    const division = DIVISIONS[divisionId];
    const isTableware = divisionId === 'tableware';
    const isSelected = activeSelection === divisionId;
    const isUnselected = activeSelection && activeSelection !== divisionId;
    const isHovered = hoveredDivision === divisionId && !activeSelection;

    return (
      <button
        key={divisionId}
        ref={ref}
        type="button"
        onClick={() => handleSelect(divisionId)}
        onMouseEnter={() => setHoveredDivision(divisionId)}
        onMouseLeave={() => setHoveredDivision(null)}
        aria-label={`Enter ${division.name}`}
        className={`relative flex-1 w-full h-1/2 md:h-full overflow-hidden flex flex-col items-center justify-center text-center px-6 sm:px-10 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#cd9922] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          !activeSelection && hoveredDivision === divisionId ? 'md:flex-[1.08]' : ''
        } ${
          isUnselected ? 'opacity-0 scale-[0.96] pointer-events-none' : 'opacity-100'
        }`}
        style={{ backgroundColor: division.theme.bgHex }}
      >
        {/* Subtle Atmospheric Division Backdrop Image */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${
            isTableware
              ? isHovered
                ? 'scale-105 opacity-[0.18]'
                : 'scale-100 opacity-[0.12]'
              : isHovered
                ? 'scale-105 opacity-[0.42]'
                : 'scale-100 opacity-[0.34]'
          } ${isSelected ? '!opacity-25' : ''}`}
        >
          <img
            src={division.previewImage}
            alt=""
            className="w-full h-full object-cover"
          />
          {isTableware ? (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(244,239,230,0.45) 0%, rgba(244,239,230,0.96) 72%)',
              }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.45) 0%, rgba(234,238,241,0.55) 100%)',
              }}
            />
          )}
        </div>

        {/* Concentric Architectural Ring Accent */}
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
            isSelected ? 'opacity-35' : 'opacity-45'
          }`}
        >
          <div
            className={`w-[360px] h-[360px] sm:w-[540px] sm:h-[540px] rounded-full border transition-transform duration-700 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            style={{
              borderColor: isTableware
                ? 'rgba(25, 36, 28, 0.08)'
                : 'rgba(255, 255, 255, 0.08)',
            }}
          />
          <div
            className={`absolute w-[500px] h-[500px] sm:w-[780px] sm:h-[780px] rounded-full border transition-transform duration-700 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            style={{
              borderColor: isTableware
                ? 'rgba(25, 36, 28, 0.05)'
                : 'rgba(255, 255, 255, 0.05)',
            }}
          />
        </div>

        {/* Top Index Pill */}
        <div
          className={`absolute top-5 sm:top-8 left-6 sm:left-10 z-10 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.26em] font-['Outfit'] transition-opacity duration-300 ${
            isSelected ? 'opacity-0' : 'opacity-70'
          }`}
          style={{ color: division.theme.textSecondary }}
        >
          {isTableware ? '01 / Division' : '02 / Division'}
        </div>

        {/* Center Brand Identity (Aligned spatially with DivisionTransitionLayer) */}
        <div className="relative z-10 flex flex-col items-center max-w-md w-full">
          <img
            src={division.logo}
            alt={division.name}
            className={`h-14 sm:h-16 md:h-[72px] w-auto object-contain transition-transform duration-500 ease-out ${
              isHovered ? 'scale-[1.04]' : 'scale-100'
            }`}
          />

          <span
            className="mt-4 text-[11px] sm:text-xs font-bold uppercase tracking-[0.34em] font-['Outfit']"
            style={{ color: division.theme.accent }}
          >
            {division.shortLabel}
          </span>

          {/* Tagline & CTA (Fades smoothly when selected so expansion focuses on Logo + Loader) */}
          <div
            className={`mt-5 sm:mt-6 flex flex-col items-center transition-all duration-300 ${
              isSelected ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            <p
              className="text-xs sm:text-sm font-['Plus_Jakarta_Sans'] leading-relaxed max-w-xs sm:max-w-sm"
              style={{ color: division.theme.textSecondary }}
            >
              {division.tagline}
            </p>

            <div
              className={`mt-6 sm:mt-8 inline-flex items-center gap-2.5 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full text-xs sm:text-sm font-semibold font-['Plus_Jakarta_Sans'] border transition-all duration-300 ${
                isTableware
                  ? isHovered
                    ? 'bg-[#28543E] text-white border-[#28543E] shadow-md'
                    : 'bg-white/60 text-[#19241C] border-[#D6CEBF]'
                  : isHovered
                    ? 'bg-[#91593A] text-white border-[#91593A] shadow-md'
                    : 'bg-white/75 backdrop-blur-xs text-[#19241C] border-black/10'
              }`}
            >
              <span>Explore {division.shortLabel.charAt(0) + division.shortLabel.slice(1).toLowerCase()}</span>
              <ArrowRight
                size={15}
                className={`transition-transform duration-300 ${
                  isHovered ? 'translate-x-1' : ''
                }`}
              />
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden flex flex-col md:flex-row bg-[#19241C]">
      {/* Card 1: Notch Tableware */}
      {renderCard('tableware', tablewareRef)}

      {/* Center Subtle Divider */}
      <div
        className={`pointer-events-none shrink-0 z-20 transition-opacity duration-300 ${
          activeSelection ? 'opacity-0' : 'opacity-100'
        } h-px w-full md:w-px md:h-full bg-gradient-to-r md:bg-gradient-to-b from-transparent via-[#cd9922]/45 to-transparent`}
      />

      {/* Card 2: Notch Hygiene */}
      {renderCard('hygiene', hygieneRef)}
    </main>
  );
}
