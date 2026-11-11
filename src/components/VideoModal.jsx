import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useBodyLock } from "../lib/hooks";

export default function VideoModal({ open, onClose }) {
  const closeRef = useRef(null);
  useBodyLock(open);
  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Video cerita Kuliah Islam Abu Dzar">
      <button type="button" className="lightbox__back" aria-label="Tutup video" tabIndex={-1} onClick={onClose} />
      <div className="lightbox__frame">
        <button type="button" ref={closeRef} className="lightbox__x" onClick={onClose} aria-label="Tutup video"><X size={20} /></button>
        <video controls autoPlay playsInline preload="auto" poster="/media/kita-story-poster.jpg"><source src="/media/kita-story.mp4" type="video/mp4" /></video>
      </div>
    </div>,
    document.body,
  );
}
