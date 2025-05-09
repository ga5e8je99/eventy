import Navbar from "../Components/Navbar";

import SVG from "../Components/SVG";

import NavDescription from "../Components/NavDescription";
import AboutSection from "../Components/AboutSection";
import OurServices from "../Components/OurServices";

import Sponsors from "../Components/Sponsors";
import Footer from "../Components/Footer";
import Statistics from "../Components/Statistics ";

export default function Onboarding() {
  return (
    <>
      <Navbar />
      <div className="navbar-section">
        <NavDescription />
        <SVG color={"#ffffff"} />
      </div>

      <AboutSection />

      <OurServices />
     <Statistics/>
      <Sponsors/>
      <Footer/>
    </>
  );
}
