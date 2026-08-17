import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

// Layout components
import HeroSection from "./components/HeroSection";
import Home from "./components/Home";
import HomeButton from "./components/HomeButton";
import Footer from "./components/Footer";

// Page components
import About from "./components/About";
import Contact from "./pages/Contact";
import Faculty from "./pages/Faculty";
import AimAndObjective from "./pages/AimAndObjective";
import Event from "./pages/Event";
import DirectorMessage from "./pages/DirectorMessage";
import AcademicProgram from "./pages/AcademicProgram";
import Staff from "./pages/Staff";
import Search from "./pages/Search";
import Notices from "./pages/Notices";
import Downloads from "./pages/Downloads";
import Gallery from "./pages/Gallery";
import Publications from "./pages/Publications";

// Admin panel (fully self-contained, own header/sidebar — no public
// site chrome around it)
import AdminApp from "./admin/AdminApp";

// The public-facing site: persistent header + footer around every
// public page. Kept separate from Admin so /admin never shows the
// site navbar/footer around it.
function PublicSite() {
  return (
    <>
      <HeroSection />

      <div className="public-page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/aim-and-objective" element={<AimAndObjective />} />
          <Route path="/events" element={<Event />} />
          <Route path="/director-message" element={<DirectorMessage />} />
          <Route path="/academic-program/:programId" element={<AcademicProgram />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/publications" element={<Publications />} />
        </Routes>
      </div>

      <HomeButton />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Admin Panel — self-contained, no public header/footer */}
      <Route path="/admin/*" element={<AdminApp />} />

      {/* Public website — everything else */}
      <Route path="/*" element={<PublicSite />} />
    </Routes>
  );
}

export default App;