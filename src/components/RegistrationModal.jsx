import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  School,
} from "lucide-react";
import ModalShell from "./ModalShell";
import { programs, programById } from "../data/programs";
import { site, whatsappUrl } from "../data/site";
import { track } from "../lib/track";

const fieldClass = "input";

const labelClass = "";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  program: "pai",
  education: "SMA/SMK/MA",
  job: "",
  domicile: "",
};

export default function RegistrationModal({ open, onClose, initialProgram = "pai" }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [lastLink, setLastLink] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm((current) => ({
      ...current,
      program: programById(initialProgram).id,
    }));
    setSubmitted(false);
    setErrors({});
  }, [open, initialProgram]);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Nama lengkap wajib diisi.";
    if (form.phone.replace(/\D/g, "").length < 9) {
      nextErrors.phone = "Masukkan nomor WhatsApp yang valid.";
    }
    if (!programById(form.program)) nextErrors.program = "Pilih program studi.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const program = programById(form.program);
    const message = [
      "*PENDAFTARAN KULIAH ISLAM ABU DZAR*",
      "Semester Genap 2026/2027",
      "",
      `Nama: ${form.name.trim()}`,
      `Program studi: ${program.name} (${program.shortName})`,
      `WhatsApp: ${form.phone.trim()}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
      form.education ? `Pendidikan terakhir: ${form.education}` : null,
      form.job.trim() ? `Pekerjaan: ${form.job.trim()}` : null,
      form.domicile.trim() ? `Domisili: ${form.domicile.trim()}` : null,
      "",
      "Saya ingin mendaftar dan mohon informasi langkah selanjutnya.",
      "Terima kasih.",
    ]
      .filter(Boolean)
      .join("\n");

    const link = whatsappUrl(message);
    setLastLink(link);
    window.open(link, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    track("registration_submit", { program: program.id });
  };

  const chosen = programById(form.program);
  return (
    <ModalShell open={open} onClose={onClose} eyebrow="Semester Genap 2026/2027" title="Pendaftaran Mahasiswa Baru">
      {submitted ? (
        <div className="done">
          <span className="ico done__ico"><CheckCircle2 size={34} /></span>
          <h3>Formulir siap dikirim</h3>
          <p>WhatsApp seharusnya terbuka di tab baru. Kirim pesan yang sudah terisi agar tim admisi dapat memproses pendaftaran Anda.</p>
          <div className="steps-box">
            <h4>Langkah berikutnya</h4>
            <ol>
              <li>Kirim pesan pendaftaran melalui WhatsApp.</li>
              <li>Transfer biaya pendaftaran Rp550.000 ke {site.bank.name} <b>{site.bank.account}</b> a/n {site.bank.holder}.</li>
              <li>Kirim bukti transfer ke tim admisi untuk verifikasi.</li>
            </ol>
          </div>
          <div className="done__act">
            <a href={lastLink || whatsappUrl()} target="_blank" rel="noreferrer" className="btn btn--navy btn--block"><MessageCircle size={18} /> Buka WhatsApp lagi</a>
            <button type="button" onClick={onClose} className="btn btn--ghost-l btn--block">Selesai</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="form-grid">
          {site.registration.externalUrl ? (
            <a href={site.registration.externalUrl} target="_blank" rel="noreferrer" className="note"><ExternalLink size={14} /> Formulir resmi juga tersedia di halaman terpisah.</a>
          ) : null}
          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend>Pilih program studi</legend>
            <div className="pick">
              {programs.map((p) => {
                const active = form.program === p.id;
                const Icon = p.id === "pai" ? BookOpen : School;
                return (
                  <button key={p.id} type="button" aria-pressed={active} className={`pick__opt${active ? " is-on" : ""}`} onClick={() => { setForm((c) => ({ ...c, program: p.id })); setErrors((c) => ({ ...c, program: undefined })); }}>
                    <Icon size={20} />
                    <b>{p.shortName}</b>
                    <small>{p.id === "pai" ? "Pendidikan Agama Islam" : "Guru Madrasah Ibtidaiyah"}</small>
                    {p.badge ? <span className="pick__new">Baru</span> : null}
                  </button>
                );
              })}
            </div>
            {errors.program ? <p className="field__err">{errors.program}</p> : null}
          </fieldset>
          <div className="field">
            <label htmlFor="reg-name">Nama lengkap <i>*</i></label>
            <input id="reg-name" type="text" autoComplete="name" value={form.name} onChange={update("name")} placeholder="Nama sesuai ijazah" className={fieldClass} aria-invalid={Boolean(errors.name)} />
            {errors.name ? <p className="field__err">{errors.name}</p> : null}
          </div>
          <div className="form-grid form-grid--2">
            <div className="field">
              <label htmlFor="reg-phone">Nomor WhatsApp <i>*</i></label>
              <input id="reg-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={update("phone")} placeholder="08xxxxxxxxxx" className={fieldClass} aria-invalid={Boolean(errors.phone)} />
              {errors.phone ? <p className="field__err">{errors.phone}</p> : null}
            </div>
            <div className="field">
              <label htmlFor="reg-email">Email <small>(opsional)</small></label>
              <input id="reg-email" type="email" autoComplete="email" value={form.email} onChange={update("email")} placeholder="nama@email.com" className={fieldClass} />
            </div>
          </div>
          <div className="form-grid form-grid--2">
            <div className="field">
              <label htmlFor="reg-education">Pendidikan terakhir</label>
              <select id="reg-education" value={form.education} onChange={update("education")} className={fieldClass}>
                <option>SMA/SMK/MA</option><option>Pondok Pesantren</option><option>D3</option><option>S1</option><option>Lainnya</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="reg-job">Pekerjaan <small>(opsional)</small></label>
              <input id="reg-job" type="text" value={form.job} onChange={update("job")} placeholder="Guru, karyawan, dll." className={fieldClass} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="reg-domicile">Domisili <small>(opsional)</small></label>
            <input id="reg-domicile" type="text" value={form.domicile} onChange={update("domicile")} placeholder="Kota/kabupaten" className={fieldClass} />
          </div>
          <p className="note"><BadgeCheck size={16} /> Data hanya digunakan untuk proses pendaftaran. Tidak ada pembayaran di halaman ini; pembayaran dilakukan melalui rekening resmi kampus.</p>
          <button type="submit" className="btn btn--gold btn--block">Daftar {chosen.shortName} via WhatsApp <ArrowRight size={19} className="arr" /></button>
          <p className="note" style={{ background: "none", padding: 0, justifyContent: "center" }}>Dengan mengirim formulir, Anda setuju dihubungi oleh tim admisi Kuliah Islam Abu Dzar.</p>
        </form>
      )}
    </ModalShell>
  );
}
