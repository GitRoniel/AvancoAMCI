import { gsap } from 'gsap';

/** Staggered entrance for a list/grid of elements. */
export function animateStagger(targets: gsap.TweenTarget, opts?: gsap.TweenVars) {
  return gsap.fromTo(
    targets,
    { y: 18, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.05, ...opts },
  );
}

/** Animate a numeric counter (KPI cards). */
export function animateNumber(
  el: HTMLElement,
  to: number,
  { duration = 1, suffix = '', decimals = 0 }: { duration?: number; suffix?: string; decimals?: number } = {},
) {
  const obj = { v: 0 };
  return gsap.to(obj, {
    v: to,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = obj.v.toFixed(decimals).replace('.', ',') + suffix;
    },
  });
}

/** Smoothly fill a progress bar to a width %. */
export function animateBar(el: HTMLElement, to: number) {
  return gsap.fromTo(el, { width: '0%' }, { width: `${to}%`, duration: 0.9, ease: 'power3.out' });
}
