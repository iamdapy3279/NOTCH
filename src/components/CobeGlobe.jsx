import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

export default function CobeGlobe({
  baseColor = [1, 1, 1],
  markerColor = [0.1, 0.5, 1],
  glowColor = [0.85, 0.92, 0.88],
  arcColor = [0.1, 0.5, 1],
  dark = 0,
}) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const pointerInteracting = useRef(null);
  const dragOffset = useRef(0);
  const [size, setSize] = useState(500);

  // Responsive wrapper sizing
  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect.width > 0) {
        setSize(entries[0].contentRect.width);
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || size === 0) return;

    let phi = 0;
    
    // Create globe with modern v2 API options
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.25,
      dark: dark,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: baseColor,
      markerColor: markerColor,
      glowColor: glowColor,
      markers: [
        { location: [19.033, 72.8996], size: 0.08 }, // JNPT/Mumbai
        { location: [34.0522, -118.2437], size: 0.05 }, // Los Angeles
        { location: [51.9225, 4.4791], size: 0.05 }, // Rotterdam
        { location: [25.2048, 55.2708], size: 0.05 }, // Jebel Ali
        { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
      ],
      arcs: [
        { from: [19.033, 72.8996], to: [34.0522, -118.2437], color: arcColor },
        { from: [19.033, 72.8996], to: [51.9225, 4.4791], color: arcColor },
        { from: [19.033, 72.8996], to: [25.2048, 55.2708], color: arcColor },
        { from: [19.033, 72.8996], to: [-33.8688, 151.2093], color: arcColor },
      ],
      arcColor: arcColor,
      arcWidth: 1.5,
    });

    // Modern manual animation loop replacing deprecated onRender
    let raf;
    const animate = () => {
      if (pointerInteracting.current === null) {
        phi += 0.035; // Rapid, energetic spin
      }
      // Mutate via the update() API
      globe.update({ phi: phi + dragOffset.current });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
    };
  }, [size, dark, JSON.stringify(baseColor), JSON.stringify(markerColor), JSON.stringify(glowColor), JSON.stringify(arcColor)]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', aspectRatio: '1/1', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", cursor: "grab", display: "block" }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - dragOffset.current * 200;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            dragOffset.current = (e.clientX - pointerInteracting.current) / 200;
          }
        }}
      />
    </div>
  );
}
