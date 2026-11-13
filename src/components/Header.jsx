import { useEffect, useRef, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import Logo from "./Logo";
import { site } from "../data/site";
import { track } from "../lib/track";
import { useBodyLock } from "../lib/hooks";

export default function Header({ onRegister, tone, active }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  useBodyLock(open);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (!open && y > 220 && y > lastY.current + 6) setHidden(true);
      else if (y < lastY.current - 6 || y < 220) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const effectiveTone = open ? "dark" : tone;
  const register = () => {
    setOpen(false);
    track("registration_open", { source: "header" });
    onRegister();
  };

  return (
    <>
    <header className={`hdr hdr--${effectiveTone}${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}${open ? " is-open" : ""}`}>
      <div className="wrap hdr__in">
        <a href="#beranda" className="hdr__logo" aria-label="Kuliah Islam Abu Dzar — ke beranda" onClick={() => setOpen(false)}>
          <Logo tone={effectiveTone} height={38} />
          <span className="hdr__brand">
            <b>KITA</b>
            <small>Kuliah Islam Abu Dzar</small>
          </span>
        </a>

        <nav className="hdr__nav" aria-label="Navigasi utama">
          {site.nav
            .filter((n) => n.href !== "#beranda")
            .map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`hdr__link${active === item.href.slice(1) ? " is-active" : ""}${item.newTab ? " hdr__link--ext" : ""}`}
                {...(item.newTab ? { target: "_blank", rel: "noopener noreferrer", onClick: () => track("portal_kita_click", { source: "header" }) } : {})}
              >
                {item.label}
                {item.newTab ? <ExternalLink size={12} strokeWidth={2.6} aria-hidden="true" /> : null}
              </a>
            ))}
        </nav>

        <div className="hdr__act">
          <button type="button" className="btn btn--gold btn--sm hdr__cta" onClick={register}>
            Daftar <ArrowRight size={15} strokeWidth={2.8} className="arr" />
          </button>
          <button type="button" className="hdr__burger" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
          </button>
        </div>
      </div>

    </header>
      <div id="menu-mobile" className={`menu${open ? " is-open" : ""}`} aria-hidden={!open}>
        <div className="menu__bg" aria-hidden="true" />
        <nav className="menu__nav" aria-label="Navigasi mobile">
          {site.nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              tabIndex={open ? 0 : -1}
              style={{ "--i": i }}
              onClick={() => {
                setOpen(false);
                if (item.newTab) track("portal_kita_click", { source: "mobile_menu" });
              }}
              {...(item.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="menu__n num">{String(i + 1).padStart(2, "0")}</span>
              <span className="menu__t">{item.label}</span>
              {item.newTab ? <ExternalLink size={18} aria-hidden="true" /> : null}
            </a>
          ))}
        </nav>
        <button type="button" tabIndex={open ? 0 : -1} className="btn btn--gold btn--block menu__cta" onClick={register}>
          Daftar Sekarang <ArrowRight size={18} className="arr" />
        </button>
      </div>
    </>
  );
}
