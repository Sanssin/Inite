import { Route, Routes } from "react-router-dom";
import React from "react";

import { NavbarComp } from "./components/Navbar";
import { Footer } from "./components/Footer";
import './components/footer.css';

import NuclearpediaMenu from "./body/nuclearpedia/NuclearpediaMenu";
import Event from "./body/Event";
import Event2 from "./body/Event2";
import Event3 from "./body/Event3";
// Homepage not used directly in routes; remove unused import
import Simulasi from "./body/Simulasi";
import Simulasi2 from "./body/Simulasi2";
import WelcomeSim from "./body/WelcomeSim";
import KenalanRekta from "./body/KenalanRekta"; // Import KenalanRekta
import Introsim from "./body/Introsim"; // Impor Introsim
import SetupSim from "./body/SetupSim";
import SetupSim2 from "./body/SetupSim2";
import SelectMode from "./body/SelectMode";
import Nuclearpedia from "./body/nuclearpedia/Nuclearpedia";
import Nuclearpedia2 from "./body/nuclearpedia/Nuclearpedia2";
import Nuclearpedia3 from "./body/nuclearpedia/Nuclearpedia3";
import Nuclearpedia4 from "./body/nuclearpedia/Nuclearpedia4";
import Nuclearpedia5 from "./body/nuclearpedia/Nuclearpedia5";
import Nuclearpedia6 from "./body/nuclearpedia/Nuclearpedia6";
import Nuclearpedia7 from "./body/nuclearpedia/Nuclearpedia7";
import Nuclearpedia8 from "./body/nuclearpedia/Nuclearpedia8";
import Nuclearpedia9 from "./body/nuclearpedia/Nuclearpedia9";
import Nuclearpedia10 from "./body/nuclearpedia/Nuclearpedia10";
import About from "./body/Aboutcont";
import Kontak from "./body/Kontak";
import HasilSimulasi from "./body/HasilSimulasi";
import HasilSimulasi2 from "./body/HasilSimulasi2";
import EdukasiRadiasi from "./body/EdukasiRadiasi";
import SimulationMenu from "./body/SimulationMenu";
import DecaySimulation from "./body/DecaySimulation";

// =========================================================
// TAMBAHAN IMPORT BARU UNTUK SIMULASI WAKTU RADIASI
// =========================================================
import SetupSimulasiWaktu from "./body/SetupSimWaktu";
import SimulasiWaktu from "./body/SimulasiWaktu";
import SimulationWaktu from "./body/SimulationWaktu";
import HasilSimulasiWaktu from "./body/HasilSimulasi3"; // Digunakan jika simulasi waktu punya halaman score/report sendiri

function App() {
  return (
    <div className="App">
      <NavbarComp />
      <div className="main-content-wrapper">
        <Routes>
          <Route path="/" element={<WelcomeSim />} />
          <Route path="/simulations" element={<SimulationMenu />} />
          <Route path="/simulations/decay" element={<DecaySimulation />} />
          <Route path="/nuclearpedia" element={<NuclearpediaMenu />} />
          <Route path="/nuclearpedia/1" element={<Nuclearpedia />} />
          <Route path="/nuclearpedia/2" element={<Nuclearpedia2 />} />
          <Route path="/nuclearpedia/3" element={<Nuclearpedia3 />} />
          <Route path="/nuclearpedia/4" element={<Nuclearpedia4 />} />
          <Route path="/nuclearpedia/5" element={<Nuclearpedia5 />} />
          <Route path="/nuclearpedia/6" element={<Nuclearpedia6 />} />
          <Route path="/nuclearpedia/7" element={<Nuclearpedia7 />} />
          <Route path="/nuclearpedia/8" element={<Nuclearpedia8 />} />
          <Route path="/nuclearpedia/9" element={<Nuclearpedia9 />} />
          <Route path="/nuclearpedia/10" element={<Nuclearpedia10 />} />
          <Route path="/event" element={<Event />} />
          <Route path="/event2" element={<Event2 />} />
          <Route path="/event3" element={<Event3 />} />
          <Route path="/startsim" element={<WelcomeSim />} />
          <Route path="/kenalan-rekta" element={<KenalanRekta />} />
          <Route path="/introsim" element={<Introsim />} />
          <Route path="/select-mode" element={<SelectMode />} />
          <Route path="/setup-misi" element={<SetupSim />} />
          
          {/* Mode Shielding Lama */}
          <Route path="/setup-simulasi" element={<SetupSim2 />} />
          <Route path="/game" element={<Simulasi />} />
          <Route path="/simulasi2" element={<Simulasi2 />} />
          <Route path="/hasil-simulasi" element={<HasilSimulasi />} />
          <Route path="/hasil-simulasi2" element={<HasilSimulasi2 />} />

          {/* =========================================================
              TAMBAHAN RUTE BARU KHUSUS SIMULASI WAKTU PAPARAN
             ========================================================= */}
          {/* Ubah path rutenya agar sesuai dengan URL navigasi dashboard-mu */}
          <Route path="/setup-waktu" element={<SetupSimulasiWaktu />} />
          <Route path="/simulations/exposure/running" element={<SimulationWaktu />} /> 
          <Route path="/hasil-simulasi-waktu" element={<HasilSimulasiWaktu />} />

          <Route path="/edukasi-radiasi" element={<EdukasiRadiasi />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Kontak />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
