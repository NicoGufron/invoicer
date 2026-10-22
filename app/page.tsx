import NavbarLanding from "./components/navbar_landing";
import HeroSection from "./components/hero_section";
import FeatureSection from "./components/feature_section";
import HowToSection from "./components/how_to_section";
import GetStartedSection from "./components/get_started_section";
import FaqSection from "./components/faq_section";
import DemoInvoiceSection from "./components/demo_invoice_section";

export default function Home() {

  return (
    <div className="w-screen h-screen">
      <NavbarLanding></NavbarLanding>
      <HeroSection></HeroSection>
      <FeatureSection></FeatureSection>
      <DemoInvoiceSection></DemoInvoiceSection>
      <HowToSection></HowToSection>
      <FaqSection></FaqSection>
      <GetStartedSection></GetStartedSection>
    </div>
  );
}
