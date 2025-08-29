import { Route, Routes } from "react-router-dom";
import React from "react";

import { NavbarComp } from "./components/Navbar";
import { Footer } from "./components/Footer";

import Nuclearpedia from "./body/Nuclearpedia";
import Event from "./body/Event";
import Event2 from "./body/Event2";
import Event3 from "./body/Event3";
import Homepage from "./body/Homepage";
import Simulasi from "./body/Simulasi";
import WelcomeSim from "./body/WelcomeSim";
import Introsim from "./body/Introsim"; // Impor Introsim
import SetupSim from "./body/SetupSim";
import Nuclearpedia2 from "./body/Nuclearpedia2";
import Nuclearpedia3 from "./body/Nuclearpedia3";
import Nuclearpedia4 from "./body/Nuclearpedia4";
import Nuclearpedia5 from "./body/Nuclearpedia5";
import Nuclearpedia6 from "./body/Nuclearpedia6";
import About from "./body/Aboutcont";
import Kontak from "./body/Kontak";
import HasilSimulasi from "./body/HasilSimulasi"; // Impor HasilSimulasi
import EdukasiRadiasi from "./body/EdukasiRadiasi"; // Impor EdukasiRadiasi

function App() {
  return (
    <div className="App">
      <NavbarComp />
      <Routes>
        <Route path="/" element={<WelcomeSim />} />
        <Route path="/nuclearpedia" element={<Nuclearpedia />} />
        <Route path="/nuclearpedia2" element={<Nuclearpedia2 />} />
        <Route path="/nuclearpedia3" element={<Nuclearpedia3 />} />
        <Route path="/nuclearpedia4" element={<Nuclearpedia4 />} />
        <Route path="/nuclearpedia5" element={<Nuclearpedia5 />} />
        <Route path="/nuclearpedia6" element={<Nuclearpedia6 />} />
        <Route path="/event" element={<Event />} />
        <Route path="/event2" element={<Event2 />} />
        <Route path="/event3" element={<Event3 />} />
        <Route path="/startsim" element={<WelcomeSim />} />
        <Route path="/introsim" element={<Introsim />} />
        <Route path="/setup" element={<SetupSim />} />
        <Route path="/game" element={<Simulasi />} />
        <Route path="/hasil-simulasi" element={<HasilSimulasi />} />
        <Route path="/edukasi-radiasi" element={<EdukasiRadiasi />} /> {/* Rute baru */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Kontak />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
