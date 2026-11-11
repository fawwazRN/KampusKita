import { useInView } from "../lib/hooks";

/* Teks judul yang muncul kata demi kata.
   "*kata*" = penekanan (serif miring). "\n" = baris baru. */
export default function Words({ text, as: Tag = "h2", className = "", delay = 0, step = 55, threshold = 0.3, enabled = true }) {
  const [ref, seen] = useInView({ threshold });
  let i = 0;
  return (
    <Tag ref={ref} className={`words ${seen && enabled ? "is-in" : ""} ${className}`.trim()} aria-label={text.replace(/\*/g, "").replace(/\n/g, " ")}>
      {text.split("\n").map((line, li) => (
        <span className="words__line" key={li} aria-hidden="true">
          {line
            .split(" ")
            .filter(Boolean)
            .map((tok) => {
              const m = tok.match(/^\*(.+)\*([.,!?:;]*)$/);
              const em = Boolean(m);
              const word = m ? m[1] : tok;
              const tail = m ? m[2] : "";
              const idx = i++;
              return (
                <span key={idx}>
                  <span className="w">
                    <span className={`w__i${em ? " w__em" : ""}`} style={{ "--d": `${delay + idx * step}ms` }}>
                      {word}
                    </span>{tail ? <span className="w__tail">{tail}</span> : null}
                  </span>{" "}
                </span>
              );
            })}
        </span>
      ))}
    </Tag>
  );
}
