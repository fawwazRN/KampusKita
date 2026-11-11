import { useState } from "react";
import { MessageCircle, Plus } from "lucide-react";
import Words from "./Words";
import Reveal from "./Reveal";
import { faqs } from "../data/faq";
import { whatsappUrl } from "../data/site";
import { track } from "../lib/track";

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="faq" data-tone="light">
      <div className="wrap faq__grid">
        <div className="faq__side">
          <Reveal><p className="eyebrow">09 · Pertanyaan</p></Reveal>
          <Words text={"Masih ragu?\n*Tanyakan* di sini."} className="h-section" />
          <Reveal delay={150}><p className="lead">Belum menemukan jawabannya? Tim admisi siap membantu lewat WhatsApp.</p></Reveal>
          <Reveal delay={220}><a className="btn btn--ghost-l" href={whatsappUrl()} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click", { source: "faq" })}><MessageCircle size={17} /> Tanya via WhatsApp</a></Reveal>
        </div>
        <Reveal delay={100} className="faq__list">
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.question} className={`qa${on ? " is-open" : ""}`}>
                <h3><button type="button" aria-expanded={on} aria-controls={`qa-${i}`} id={`qq-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                  <span className="qa__n num">{String(i + 1).padStart(2, "0")}</span><span className="qa__q">{f.question}</span><span className="qa__i"><Plus size={18} strokeWidth={2.6} /></span>
                </button></h3>
                <div id={`qa-${i}`} role="region" aria-labelledby={`qq-${i}`} className="qa__a"><div><p>{f.answer}</p></div></div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
