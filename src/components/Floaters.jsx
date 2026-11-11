import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { site, whatsappUrl } from "../data/site";
import { track } from "../lib/track";
import { WhatsAppIcon } from "./Icons";

export function ScrollProgress() {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const v = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      document.documentElement.style.setProperty("--scroll", v.toFixed(4));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return <div className="progress" aria-hidden="true"><span /></div>;
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const on = () => setVisible(window.scrollY > 900);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button type="button" className={`totop${visible ? " is-on" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Kembali ke atas" tabIndex={visible ? 0 : -1}>
      <ArrowUp size={19} strokeWidth={2.6} />
    </button>
  );
}

export function WhatsAppFloat() {
  return (
    <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="wa" onClick={() => track("whatsapp_click", { source: "floating" })} aria-label={`Hubungi ${site.name} via WhatsApp ${site.phoneDisplay}`}>
      <span className="wa__ping" aria-hidden="true" />
      <WhatsAppIcon size={26} />
      <span className="wa__t">Chat Admisi</span>
    </a>
  );
}
