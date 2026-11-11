import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useBodyLock } from "../lib/hooks";

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ModalShell({ open, onClose, title, eyebrow, children, small = false }) {
  const panel = useRef(null);
  const prev = useRef(null);
  const [render, setRender] = useState(false);
  const [closing, setClosing] = useState(false);
  useBodyLock(open);

  useEffect(() => {
    if (open) { setClosing(false); setRender(true); return undefined; }
    if (render) { setClosing(true); const t = setTimeout(() => setRender(false), 420); return () => clearTimeout(t); }
    return undefined;
  }, [open, render]);

  useEffect(() => {
    if (!open) return undefined;
    prev.current = document.activeElement;
    const t = setTimeout(() => panel.current?.querySelector(FOCUSABLE)?.focus(), 60);
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const nodes = [...panel.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); if (prev.current instanceof HTMLElement) prev.current.focus(); };
  }, [open, onClose]);

  if (!render) return null;
  return createPortal(
    <div className="drawer-root">
      <button type="button" className={`drawer__back${closing ? " closing" : ""}`} aria-label="Tutup panel" tabIndex={-1} onClick={onClose} />
      <div ref={panel} className={`drawer${small ? " drawer--sm" : ""}${closing ? " closing" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="drawer__head">
          <div>{eyebrow ? <p className="drawer__eyebrow">{eyebrow}</p> : null}<h2 id="modal-title" className="drawer__title">{title}</h2></div>
          <button type="button" className="drawer__x" onClick={onClose} aria-label="Tutup"><X size={20} /></button>
        </div>
        <div className="drawer__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
