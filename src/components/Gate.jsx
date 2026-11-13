import { useEffect, useState } from "react";
import { useBodyLock, useStableCallback } from "../lib/hooks";
import Logo from "./Logo";

/* Gerbang pembuka: dua daun pintu terbuka = "kuliah terbuka untuk semua".
   Hanya tampil sekali per sesi; dilewati bila pengguna memilih gerak minimal. */
export default function Gate({ onOpen, onDone }) {
  const [phase, setPhase] = useState("hold");
  const done = useStableCallback(onDone);
  const opened = useStableCallback(onOpen);
  useBodyLock(true);

  useEffect(() => {
    const t1 = window.setTimeout(() => {
      setPhase("open");
      opened();
    }, 650);
    const t2 = window.setTimeout(() => done(), 650 + 950);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [done, opened]);

  return (
    <div className={`gate gate--${phase}`} role="status" aria-label="Membuka halaman">
      <div className="gate__door gate__door--l" aria-hidden="true">
        <span className="gate__arch" />
      </div>
      <div className="gate__door gate__door--r" aria-hidden="true">
        <span className="gate__arch" />
      </div>
      <div className="gate__seam" aria-hidden="true" />
      <div className="gate__core">
        <p className="gate__bismillah" lang="ar" dir="rtl">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <div className="gate__logo">
          <Logo tone="light" height={64} />
        </div>
        <p className="gate__line">Kuliah Islam Terbuka</p>
        <span className="gate__bar" aria-hidden="true" />
      </div>
    </div>
  );
}
