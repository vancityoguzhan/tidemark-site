import { useEffect, useRef } from "react";

interface TidalFieldProps {
  harmony: number;
}

const CONTOUR_COUNT = 28;
const STEP_PX = 12;
const EDGE_BLEED_PX = 40;
const STATIC_TIME = 1.6;

function clampHarmony(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export default function TidalField({ harmony }: TidalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetHarmonyRef = useRef(clampHarmony(harmony));
  const syncHarmonyRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    targetHarmonyRef.current = clampHarmony(harmony);
    syncHarmonyRef.current?.();
  }, [harmony]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId: number | null = null;
    let isDisposed = false;
    let isIntersecting = true;
    let lastTimestamp: number | null = null;
    let simTime = STATIC_TIME;
    let currentHarmony = targetHarmonyRef.current;

    const finePointer =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: fine)").matches;
    const reducedMotionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    let reducedMotion = reducedMotionQuery?.matches ?? false;

    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let pointerStrength = 0;
    let targetPointerStrength = 0;

    function measure() {
      if (!canvas || !context) return;
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.max(0, rect.width);
      const nextHeight = Math.max(0, rect.height);
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);

      if (
        nextWidth === width &&
        nextHeight === height &&
        nextDpr === dpr &&
        canvas.width > 0
      ) {
        return;
      }

      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;

      if (width > 0 && height > 0) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }

    function drawFrame(h: number, time: number) {
      if (!context || width <= 0 || height <= 0) return;

      context.clearRect(0, 0, width, height);

      // Soft Pacific atmospheric glow behind the contours (never neon).
      const glowR = Math.round(190 * (1 - h) + 110 * h);
      const glowG = Math.round(140 * (1 - h) + 174 * h);
      const glowB = Math.round(102 * (1 - h) + 166 * h);
      const glowA = 0.065 * (1 - h) + 0.11 * h;

      const glowCenterX = width * 0.5;
      const glowCenterY = height * 0.58;
      const glowRadius = Math.max(width, height) * 0.65;
      const radial = context.createRadialGradient(
        glowCenterX,
        glowCenterY,
        0,
        glowCenterX,
        glowCenterY,
        glowRadius,
      );
      radial.addColorStop(
        0,
        `rgba(${glowR}, ${glowG}, ${glowB}, ${glowA.toFixed(4)})`,
      );
      radial.addColorStop(
        0.55,
        `rgba(${glowR}, ${glowG}, ${glowB}, ${(glowA * 0.35).toFixed(4)})`,
      );
      radial.addColorStop(1, `rgba(${glowR}, ${glowG}, ${glowB}, 0)`);
      context.fillStyle = radial;
      context.fillRect(0, 0, width, height);

      const xStart = -EDGE_BLEED_PX;
      const xEnd = width + EDGE_BLEED_PX;
      const pointCount = Math.ceil((xEnd - xStart) / STEP_PX) + 1;
      const wakeActive = finePointer && !reducedMotion && pointerStrength > 0.002;
      const wakeSigmaSq2 = 2 * 110 * 110;
      const wakeMaxDistSq = 440 * 440;

      for (let i = 0; i < CONTOUR_COUNT; i++) {
        const u = i / (CONTOUR_COUNT - 1);
        // Slightly denser distribution across the middle horizon (38%-78%).
        const warped = u + 0.1 * Math.sin(2 * Math.PI * u);
        const baseY = height * (0.12 + 0.82 * warped);

        const vertFade = Math.pow(Math.sin(u * Math.PI), 0.85);
        // Keep contours slightly quieter behind the upper headline for clear contrast.
        const headlineCalm = u < 0.28 ? 0.68 + 0.32 * (u / 0.28) : 1;
        const isRidge = i % 4 === 0;

        const r = Math.round(
          (isRidge ? 216 : 154) * (1 - h) + (isRidge ? 242 : 138) * h,
        );
        const g = Math.round(
          (isRidge ? 164 : 175) * (1 - h) + (isRidge ? 239 : 196) * h,
        );
        const b = Math.round(
          (isRidge ? 127 : 196) * (1 - h) + (isRidge ? 233 : 188) * h,
        );
        const baseAlpha =
          ((isRidge ? 0.26 : 0.145) + (isRidge ? 0.08 : 0.055) * h) *
          vertFade *
          headlineCalm;

        const strokeGrad = context.createLinearGradient(0, 0, width, 0);
        const alphaStr = baseAlpha.toFixed(4);
        strokeGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        strokeGrad.addColorStop(0.1, `rgba(${r}, ${g}, ${b}, ${alphaStr})`);
        strokeGrad.addColorStop(0.9, `rgba(${r}, ${g}, ${b}, ${alphaStr})`);
        strokeGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        context.strokeStyle = strokeGrad;
        context.lineWidth = isRidge
          ? 1.38
          : 0.85 + 0.28 * Math.sin(u * Math.PI);

        const seedPhase = Math.sin(i * 12.9898) * 6.283;
        const dyPointer = baseY - pointerY;
        const lineWakeScale = wakeActive
          ? Math.tanh(dyPointer / 48) * pointerStrength * 17
          : 0;

        let prevX = xStart;
        let prevY = 0;

        context.beginPath();
        for (let p = 0; p < pointCount; p++) {
          const x = Math.min(xStart + p * STEP_PX, xEnd);

          const scatteredY =
            Math.sin(x * 0.011 + time * 1.15 + seedPhase) * 14 +
            Math.sin(x * 0.023 - time * 0.85 + seedPhase * 1.7 + u * 5) * 7.5 +
            Math.cos(x * 0.0055 + time * 0.45 - seedPhase * 0.8) * 9;

          const harmonicY =
            Math.sin(x * 0.0042 - time * 0.55 + u * 1.15) * 18 +
            Math.sin(x * 0.0084 - time * 0.35 + u * 0.65 + 0.8) * 5.5;

          let y = baseY + scatteredY * (1 - h) + harmonicY * h;

          if (wakeActive) {
            const dx = x - pointerX;
            const distSq = dx * dx + dyPointer * dyPointer;
            if (distSq < wakeMaxDistSq) {
              const influence = Math.exp(-distSq / wakeSigmaSq2);
              y +=
                lineWakeScale *
                influence *
                (0.75 + 0.25 * Math.sin(distSq * 0.00016 - time * 1.6));
            }
          }

          if (p === 0) {
            context.moveTo(x, y);
          } else if (p < pointCount - 1) {
            const midX = (prevX + x) * 0.5;
            const midY = (prevY + y) * 0.5;
            context.quadraticCurveTo(prevX, prevY, midX, midY);
          } else {
            context.quadraticCurveTo(prevX, prevY, x, y);
          }

          prevX = x;
          prevY = y;
        }
        context.stroke();
      }
    }

    function stopLoop() {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastTimestamp = null;
    }

    function shouldAnimate() {
      return (
        !isDisposed &&
        !reducedMotion &&
        isIntersecting &&
        !document.hidden &&
        width > 0 &&
        height > 0
      );
    }

    function tick(now: number) {
      rafId = null;
      if (!shouldAnimate()) return;

      const dt =
        lastTimestamp === null ? 0.016 : Math.min((now - lastTimestamp) / 1000, 0.05);
      lastTimestamp = now;

      simTime += dt;
      const harmonyAlpha = 1 - Math.exp(-dt * 2.4);
      currentHarmony += (targetHarmonyRef.current - currentHarmony) * harmonyAlpha;

      if (finePointer) {
        const ptrAlpha = 1 - Math.exp(-dt * 6.5);
        pointerX += (targetPointerX - pointerX) * ptrAlpha;
        pointerY += (targetPointerY - pointerY) * ptrAlpha;
        pointerStrength += (targetPointerStrength - pointerStrength) * ptrAlpha;
      }

      drawFrame(currentHarmony, simTime);
      rafId = window.requestAnimationFrame(tick);
    }

    function startOrRenderStatic() {
      measure();
      if (width <= 0 || height <= 0) return;

      if (reducedMotion) {
        stopLoop();
        currentHarmony = targetHarmonyRef.current;
        drawFrame(currentHarmony, STATIC_TIME);
        return;
      }

      drawFrame(currentHarmony, simTime);
      if (shouldAnimate() && rafId === null) {
        lastTimestamp = null;
        rafId = window.requestAnimationFrame(tick);
      } else if (!shouldAnimate()) {
        stopLoop();
      }
    }

    syncHarmonyRef.current = () => {
      if (reducedMotion) {
        currentHarmony = targetHarmonyRef.current;
        drawFrame(currentHarmony, STATIC_TIME);
      } else if (shouldAnimate() && rafId === null) {
        startOrRenderStatic();
      }
    };

    function handlePointerMove(event: PointerEvent) {
      if (!canvas || !finePointer || reducedMotion || !isIntersecting) return;
      const rect = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (inside) {
        const nextX = event.clientX - rect.left;
        const nextY = event.clientY - rect.top;
        if (pointerStrength < 0.01) {
          pointerX = nextX;
          pointerY = nextY;
        }
        targetPointerX = nextX;
        targetPointerY = nextY;
        targetPointerStrength = 1;
      } else {
        targetPointerStrength = 0;
      }
    }

    function handlePointerLeave() {
      targetPointerStrength = 0;
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopLoop();
      } else {
        startOrRenderStatic();
      }
    }

    function handleMotionChange(event: MediaQueryListEvent) {
      reducedMotion = event.matches;
      startOrRenderStatic();
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        startOrRenderStatic();
      });
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", startOrRenderStatic);
    }

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isIntersecting = entry ? entry.isIntersecting : true;
          if (!isIntersecting) {
            targetPointerStrength = 0;
            stopLoop();
          } else {
            startOrRenderStatic();
          }
        },
        { threshold: 0 },
      );
      intersectionObserver.observe(canvas);
    }

    if (finePointer) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.addEventListener("pointerleave", handlePointerLeave);
      window.addEventListener("blur", handlePointerLeave);
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery?.addEventListener("change", handleMotionChange);

    startOrRenderStatic();

    return () => {
      isDisposed = true;
      syncHarmonyRef.current = null;
      stopLoop();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", startOrRenderStatic);
      intersectionObserver?.disconnect();
      if (finePointer) {
        window.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerleave", handlePointerLeave);
        window.removeEventListener("blur", handlePointerLeave);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery?.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="fTidalCanvas" aria-hidden="true" />;
}
