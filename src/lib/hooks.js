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

/* ---------- progres scroll -> variabel CSS ----------
   mode "pin"  : elemen tinggi (sticky stage di dalamnya). p = 0 saat atas elemen
                 menyentuh atas layar, 1 saat bawah elemen menyentuh bawah layar.
   mode "exit" : p = 0 saat atas elemen di atas layar, 1 saat elemen sudah keluar seluruhnya.
   mode "pass" : p = 0 saat elemen mulai masuk dari bawah, 1 saat keluar di atas.
   Nilai ditulis langsung ke style (tanpa re-render React).
   phases: { nama: [mulai, selesai] } -> --nama bernilai 0..1.            */
export function useScrollPhases(ref, { mode = "pin", phases = {}, onProgress, start = 0, end = 1 } = {}) {
  const cfg = useRef({ phases, onProgress, mode, start, end });
  cfg.current = { phases, onProgress, mode, start, end };

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;

    const write = (p) => {
      const { phases: ph, onProgress: cb } = cfg.current;
      el.style.setProperty("--p", p.toFixed(4));
      for (const key in ph) {
        const [a, b] = ph[key];
        const t = Math.min(1, Math.max(0, (p - a) / (b - a || 1)));
        el.style.setProperty(`--${key}`, t.toFixed(4));
      }
      cb?.(p);
    };

    const measure = () => {
      raf = 0;
      if (prefersReducedMotion()) {
        write(1);
        return;
      }
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) {
        // jauh dari layar: pastikan nilai ujung benar tanpa kerja berlebih
        write(r.top > 0 ? 0 : 1);
        return;
      }
      let p;
      if (cfg.current.mode === "pin") {
        const span = Math.max(1, r.height - vh);
        p = -r.top / span;
      } else if (cfg.current.mode === "exit") {
        p = -r.top / Math.max(1, r.height);
      } else {
        const { start: s, end: e } = cfg.current;
        const raw = (vh - r.top) / (vh + r.height);
        p = (raw - s) / (e - s || 1);
      }
      write(Math.min(1, Math.max(0, p)));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
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
