import { useCallback, useEffect, useRef, useState } from "react";

/* ---------- reduced motion ---------- */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/* ---------- in-view (sekali / berulang) ---------- */
export function useInView({ threshold = 0.2, rootMargin = "0px 0px -8% 0px", once = true } = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) {
      setSeen(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          if (once) io.disconnect();
        } else if (!once) {
          setSeen(false);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);
  return [ref, seen];
}

/* ---------- penjadwal scroll bersama ----------
   Satu listener + satu rAF untuk SEMUA elemen yang bergerak mengikuti scroll.
   Baca layout dulu (batch), baru tulis style -> tidak ada layout thrashing.
   Elemen yang jauh di luar layar dilewati setelah nilai ujungnya tertulis.   */
const scrubItems = new Set();
let scrubRaf = 0;
let scrubBound = false;

function scrubLoop() {
  scrubRaf = 0;
  const vh = window.innerHeight;
  const batch = [];
  scrubItems.forEach((it) => {
    const r = it.el.getBoundingClientRect();
    const zone = r.bottom < -vh * 0.7 ? -1 : r.top > vh * 1.7 ? 1 : 0;
    if (zone !== 0 && it.zone === zone) return;
    it.zone = zone;
    batch.push([it, r]);
  });
  for (let i = 0; i < batch.length; i++) batch[i][0].fn(batch[i][1], vh);
}
export function scheduleScrub() {
  if (!scrubRaf) scrubRaf = requestAnimationFrame(scrubLoop);
}
function bindScrub() {
  if (scrubBound) return;
  scrubBound = true;
  window.addEventListener("scroll", scheduleScrub, { passive: true });
  window.addEventListener("resize", () => {
    scrubItems.forEach((it) => (it.zone = 9));
    scheduleScrub();
  });
}

/* fn(rect, vh) dipanggil setiap frame scroll selama elemen dekat layar */
export function useScrub(ref, fn) {
  const cb = useRef(fn);
  cb.current = fn;
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const item = { el, zone: 9, fn: (r, vh) => cb.current(r, vh, el) };
    scrubItems.add(item);
    bindScrub();
    scheduleScrub();
    return () => scrubItems.delete(item);
  }, [ref]);
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export { clamp01 };

/* progres elemen -> variabel CSS.
   mode "pin"  : elemen tinggi dengan stage sticky di dalamnya (0..1 selama di-pin)
   mode "exit" : 0 saat atas elemen di atas layar, 1 saat elemen sudah keluar
   mode "enter": 0 saat atas elemen menyentuh bawah layar, 1 saat seluruh elemen sudah terlihat (cocok untuk footer).
   mode "pass" : 0 saat elemen mulai masuk dari bawah, 1 saat keluar di atas (dapat dipotong start/end)
   phases: { nama: [mulai, selesai] } -> --nama bernilai 0..1                       */
export function useScrollPhases(ref, { mode = "pin", phases = {}, onProgress, start = 0, end = 1 } = {}) {
  const cfg = useRef({});
  cfg.current = { phases, onProgress, mode, start, end };

  useScrub(ref, (r, vh, el) => {
    const { phases: ph, onProgress: cb, mode: m, start: s0, end: e0 } = cfg.current;
    let p = 1;
    if (!prefersReducedMotion()) {
      if (m === "pin") p = -r.top / Math.max(1, r.height - vh);
      else if (m === "exit") p = -r.top / Math.max(1, r.height);
      else if (m === "enter") p = (vh - r.top) / Math.max(1, r.height);
      else p = ((vh - r.top) / (vh + r.height) - s0) / (e0 - s0 || 1);
      p = clamp01(p);
    }
    el.style.setProperty("--p", p.toFixed(4));
    for (const key in ph) {
      const [a, b] = ph[key];
      el.style.setProperty(`--${key}`, clamp01((p - a) / (b - a || 1)).toFixed(4));
    }
    cb?.(p, el);
  });
}

/* kemunculan mengikuti scroll: --t 0..1 saat elemen naik dari 94% ke 58% tinggi layar */
export function useReveal(ref, shift = 0) {
  const last = useRef(-1);
  useScrub(ref, (r, vh, el) => {
    let t = 1;
    if (!prefersReducedMotion()) t = clamp01((vh * (0.95 - shift) - r.top) / (vh * 0.34));
    t = Math.round(t * 200) / 200;
    if (t !== last.current) {
      last.current = t;
      el.style.setProperty("--t", t);
    }
  });
}

/* ---------- angka naik ---------- */
export function useCountUp(target, { run = true, duration = 1400, from = 0 } = {}) {
  const [value, setValue] = useState(prefersReducedMotion() ? target : from);
  useEffect(() => {
    if (!run) return undefined;
    if (prefersReducedMotion()) {
      setValue(target);
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration, from]);
  return value;
}

/* ---------- scrollspy ---------- */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.38;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= line) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids]);
  return active;
}

/* ---------- nada (terang / gelap) di bawah header ---------- */
export function useToneUnderHeader(y = 40) {
  const [tone, setTone] = useState("dark");
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const nodes = document.querySelectorAll("[data-tone]");
      let found = "dark";
      nodes.forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) found = n.getAttribute("data-tone") || found;
      });
      setTone(found);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { attributes: true, attributeFilter: ["data-tone"], subtree: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [y]);
  return tone;
}

/* ---------- kunci scroll body (hitung ref agar tidak saling menimpa) ---------- */
let lockCount = 0;
export function useBodyLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    lockCount += 1;
    document.documentElement.classList.add("is-locked");
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) document.documentElement.classList.remove("is-locked");
    };
  }, [active]);
}

export function useStableCallback(fn) {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args) => ref.current?.(...args), []);
}
