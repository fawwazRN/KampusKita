import { useRef } from "react";
import { useInView, useReveal } from "../lib/hooks";

/* Muncul MENGIKUTI scroll (scrub): berhenti di tengah = berhenti di tengah.
   timed = true -> animasi waktu biasa (dipakai di hero saat halaman dibuka). */
export default function Reveal({ children, className = "", delay = 0, as: Tag = "div", variant = "up", timed = false, enabled = true, style, ...rest }) {
  const ref = useRef(null);
  const [vref, seen] = useInView({ threshold: 0.15 });
  if (timed) {
    return (
      <Tag ref={vref} data-timed={variant} className={`${seen && enabled ? "is-in" : ""} ${className}`.trim()} style={{ ...(delay ? { "--d": `${delay}ms` } : null), ...style }} {...rest}>
        {children}
      </Tag>
    );
  }
  return <Scrub Tag={Tag} refEl={ref} variant={variant} className={className} delay={delay} style={style} rest={rest}>{children}</Scrub>;
}

function Scrub({ Tag, refEl, variant, className, delay, style, rest, children }) {
  useReveal(refEl, Math.min(0.12, delay / 4000));
  return (
    <Tag ref={refEl} data-reveal={variant} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}
