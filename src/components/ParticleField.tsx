"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  baseOpacity: number;
  opacity: number;
  opacityTarget: number;
}

interface ParticleFieldProps {
  density?: number;
  linkDistance?: number;
  mouseRadius?: number;
  repulseDistance?: number;
  className?: string;
  colors?: string[];
  linkColor?: string;
  mouseLinkColor?: string;
  speed?: number;
}

export default function ParticleField({
  density = 0.00008,
  linkDistance = 150,
  mouseRadius = 160,
  repulseDistance = 110,
  className = "",
  colors = ["100, 116, 139", "148, 163, 184", "59, 130, 246"],
  linkColor = "148, 163, 184",
  mouseLinkColor = "37, 99, 235",
  speed = 1.2,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const createParticle = (w: number, h: number): Particle => {
      const base = 0.25 + Math.random() * 0.35;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: 1 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseOpacity: base,
        opacity: base,
        opacityTarget: base,
      };
    };

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.max(40, Math.floor(width * height * density));
      const current = particlesRef.current;
      if (current.length === 0) {
        particlesRef.current = Array.from({ length: target }, () =>
          createParticle(width, height)
        );
      } else if (current.length < target) {
        for (let i = 0; i < target - current.length; i++) {
          current.push(createParticle(width, height));
        }
      } else if (current.length > target) {
        current.length = target;
      }
      for (const p of particlesRef.current) {
        if (p.x > width) p.x = width;
        if (p.y > height) p.y = height;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const render = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const repulseSq = repulseDistance * repulseDistance;
      const mouseRadiusSq = mouseRadius * mouseRadius;
      const linkDistanceSq = linkDistance * linkDistance;

      for (const p of particles) {
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < repulseSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / repulseDistance) * 1.5;
            p.vx += (dx / dist) * force * 0.4;
            p.vy += (dy / dist) * force * 0.4;
          }
        }

        p.vx *= 0.96;
        p.vy *= 0.96;

        const minSpeed = 0.05;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp < minSpeed) {
          p.vx += (Math.random() - 0.5) * 0.05;
          p.vy += (Math.random() - 0.5) * 0.05;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        if (Math.random() < 0.01) {
          p.opacityTarget = p.baseOpacity * (0.6 + Math.random() * 0.6);
        }
        p.opacity += (p.opacityTarget - p.opacity) * 0.04;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < linkDistanceSq) {
            const alpha = (1 - distSq / linkDistanceSq) * 0.4;
            ctx.strokeStyle = `rgba(${linkColor}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        if (mouse.active) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < mouseRadiusSq) {
            const alpha = (1 - distSq / mouseRadiusSq) * 0.75;
            ctx.strokeStyle = `rgba(${mouseLinkColor}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    resize();
    render();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [
    density,
    linkDistance,
    mouseRadius,
    repulseDistance,
    colors,
    linkColor,
    mouseLinkColor,
    speed,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-auto absolute inset-0 h-full w-full ${className}`}
    />
  );
}
