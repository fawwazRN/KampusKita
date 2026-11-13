import { useCallback, useEffect, useMemo, useState } from "react";
import Analytics from "./components/Analytics";
import Gate from "./components/Gate";
import Header from "./components/Header";
import Rail, { chapterIds } from "./components/Rail";
import Hero from "./components/Hero";
import Pekan from "./components/Pekan";
import Usia from "./components/Usia";
import Prodi from "./components/Prodi";
import Biaya from "./components/Biaya";
import Daftar from "./components/Daftar";
import Dosen from "./components/Dosen";
import Akademik from "./components/Akademik";
import FAQ from "./components/FAQ";
import Fajar from "./components/Fajar";
import Kartu from "./components/Kartu";
import Footer from "./components/Footer";
import RegistrationModal from "./components/RegistrationModal";
import CurriculumModal from "./components/CurriculumModal";
import VideoModal from "./components/VideoModal";
import { programs } from "./data/programs";
import { BackToTop, ScrollProgress, WhatsAppFloat } from "./components/Floaters";
import { site } from "./data/site";
import { useActiveSection, useToneUnderHeader, prefersReducedMotion } from "./lib/hooks";

const GATE_KEY = "kita-gate-v1";
const skipGate = () => {
  if (prefersReducedMotion()) return true;
  try {
    return window.sessionStorage.getItem(GATE_KEY) === "1";
  } catch {
    return false;
  }
};

export default function App() {
  const [gate, setGate] = useState(() => (skipGate() ? "done" : "closed"));
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationProgram, setRegistrationProgram] = useState("pai");
  const [registrationName, setRegistrationName] = useState("");
  const [curriculumProgram, setCurriculumProgram] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const tone = useToneUnderHeader(40);
  const ids = useMemo(() => chapterIds, []);
  const active = useActiveSection(ids);

  const openRegistration = useCallback((programId = "pai", name = "") => {
    if (site.registration.externalUrl) {
      window.open(site.registration.externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setCurriculumProgram(null);
    setRegistrationProgram(programId);
    setRegistrationName(typeof name === "string" ? name : "");
    setRegistrationOpen(true);
  }, []);

  useEffect(() => {
    const boot = document.getElementById("boot-loader");
    if (boot) {
      boot.style.opacity = "0";
      window.setTimeout(() => boot.remove(), 420);
    }
  }, []);

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#daftar") {
        openRegistration("pai");
        window.setTimeout(() => window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`), 0);
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [openRegistration]);

  const onGateDone = useCallback(() => {
    try {
      window.sessionStorage.setItem(GATE_KEY, "1");
    } catch {
      /* abaikan */
    }
    setGate("done");
  }, []);

  const ready = gate !== "closed";

  return (
    <div className="app">
      <Analytics />
      <a href="#beranda" className="skip-link">Lewati ke konten utama</a>
      <ScrollProgress />
      {gate !== "done" ? <Gate onOpen={() => setGate("open")} onDone={onGateDone} /> : null}

      <Header tone={tone} active={active} onRegister={() => openRegistration("pai")} />
      <Rail active={active} tone={tone} />

      <main>
        <Hero ready={ready} onRegister={() => openRegistration("pai")} onPlay={() => setVideoOpen(true)} />
        <Pekan />
        <Usia />
        <Prodi onRegister={openRegistration} onOpenCurriculum={(id) => setCurriculumProgram(programs.find((x) => x.id === id) ?? null)} />
        <Biaya onRegister={() => openRegistration("pai")} />
        <Daftar onRegister={() => openRegistration("pai")} />
        <Dosen />
        <Akademik onRegister={() => openRegistration("pai")} />
        <FAQ />
        <Fajar onRegister={() => openRegistration("pai")} />
        <Kartu onRegister={openRegistration} />
      </main>
      <Footer />

      <RegistrationModal open={registrationOpen} onClose={() => setRegistrationOpen(false)} initialProgram={registrationProgram} initialName={registrationName} />
      <CurriculumModal program={curriculumProgram} onClose={() => setCurriculumProgram(null)} onRegister={(id) => { setCurriculumProgram(null); openRegistration(id); }} />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
      <WhatsAppFloat />
      <BackToTop />
    </div>
  );
}
