import { useRef } from "react";
import { useInView, useReveal } from "../lib/hooks";

/* Judul kata-demi-kata. "*kata*" = penekanan (serif miring). "\n" = baris baru.
   Default: kata muncul sesuai posisi scroll. timed -> animasi waktu (hero). */
export default function Words({ text, as: Tag = "h2", className = "", delay = 0, step = 55, timed = false, enabled = true }) {
  const ref = useRef(null);
  const [vref, seen] = useInView({ threshold: 0.01 });
  const lines = text.split("\n");
  const total = text.replace(/\n/g, " ").split(" ").filter(Boolean).length;
  let i = 0;
  const body = lines.map((line, li) => (
    <span className="words__line" key={li} aria-hidden="true">
      {line.split(" ").filter(Boolean).map((tok) => {
        const m = tok.match(/^\*(.+)\*([.,!?:;]*)$/);
        const word = m ? m[1] : tok;
        const tail = m ? m[2] : "";
        const idx = i++;
        return (
          <span key={idx}>
            <span className="w">
              <span className={`w__i${m ? " w__em" : ""}`} style={{ "--i": idx, "--d": `${delay + idx * step}ms` }}>{word}</span>
              {tail ? <span className="w__tail">{tail}</span> : null}
            </span>{" "}
          </span>
        );
      })}
    </span>
  ));
  const label = text.replace(/\*/g, "").replace(/\n/g, " ");
  if (timed) {
    return <Tag ref={vref} data-timed-words className={`words ${seen && enabled ? "is-in" : ""} ${className}`.trim()} aria-label={label}>{body}</Tag>;
  }
  return <Scrubbed Tag={Tag} refEl={ref} className={className} label={label} total={total}>{body}</Scrubbed>;
}

function Scrubbed({ Tag, refEl, className, label, total, children }) {
  useReveal(refEl, 0);
  return (
    <Tag ref={refEl} className={`words ${className}`.trim()} style={{ "--n": total }} aria-label={label}>
      {children}
    </Tag>
  );
}
