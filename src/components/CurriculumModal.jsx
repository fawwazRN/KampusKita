import {
  ArrowRight,
  BookOpen,
  Clock3,
  MessageCircle,
  GraduationCap,
} from "lucide-react";
import ModalShell from "./ModalShell";
import { site, whatsappUrl } from "../data/site";
import { track } from "../lib/track";

export default function CurriculumModal({ program, onClose, onRegister }) {
  const open = Boolean(program);

  return (
    <ModalShell open={open} onClose={onClose} small eyebrow={program ? `${program.shortName} · ${program.degree}` : undefined} title="Struktur Kurikulum">
      {program ? (
        <div className="cur">
          <div className="cur__top"><span className="ico"><BookOpen size={22} /></span><div><small>Program Studi S1</small><h3>{program.name}</h3><em>Gelar {program.degree}</em></div></div>
          <p className="cur__d">{program.description}</p>
          {program.curriculum?.length ? (
            <div className="cur__sems">{program.curriculum.map((s) => (<div key={s.semester}><b>Semester {s.semester}</b><ul>{s.courses.map((x) => <li key={x}>• {x}</li>)}</ul></div>))}</div>
          ) : (
            <div className="cur__soon"><Clock3 size={20} /><div><h4>Naskah kurikulum sedang disiapkan</h4><p>Struktur lengkap {program.shortName} akan ditampilkan setelah naskah resmi dari kampus diterima. Tim admisi dapat membantu memberi informasi awal.</p></div></div>
          )}
          <div className="cur__act">
            <a href={whatsappUrl(`Assalamu'alaikum, saya ingin menanyakan struktur kurikulum ${program.name} di ${site.name}.`)} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click", { source: "curriculum" })} className="btn btn--ghost-l btn--sm"><MessageCircle size={16} /> Tanya admisi</a>
            <button type="button" onClick={() => { track("registration_open", { source: `curriculum_${program.id}` }); onRegister(program.id); }} className="btn btn--gold btn--sm">Daftar {program.shortName} <ArrowRight size={16} className="arr" /></button>
          </div>
          <p className="cur__foot"><GraduationCap size={14} /> Gelar S.Pd. · Kurikulum OBE</p>
        </div>
      ) : null}
    </ModalShell>
  );
}
