import NavbarLanding from "./components/navbar_landing";
import HeroSection from "./components/hero_section";
import FeatureSection from "./components/feature_section";
import HowToSection from "./components/how_to_section";

export default function Home() {

  return (
    <div className="w-screen h-screen">
      <NavbarLanding></NavbarLanding>
      <HeroSection></HeroSection>
      <div className="border bg-[var(--surface)]">
        <div className="grid grid-cols-3">
          <div className="flex flex-col items-center py-5">
            <p className="text-3xl font-bold text-[var(--primary)]">30<span className="text-[var(--green)]">s</span></p>
            <p className="text-sm pt-2.5">Average creation time</p>
          </div>
          <div className="flex flex-col items-center py-5 border-l-1">
            <p className="text-3xl font-bold"><span className="text-[var(--green)]">∞</span></p>
            <p className="text-sm pt-2.5">Invoice count - no cap, ever</p>
          </div>

          <div className="flex flex-col items-center py-5 border-l-1">
            <p className="text-3xl font-bold text-[var(--primary)]">3</p>
            <p className="text-sm pt-2.5">Export formats: PDF, JSON, email</p>
          </div>
        </div>
      </div>

      <FeatureSection></FeatureSection>
      <HowToSection></HowToSection>
    </div>
  );
}
