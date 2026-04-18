import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import InternalToolsSection from "@/components/InternalToolsSection";
import TechSection from "@/components/TechSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollAnimator from "@/components/ScrollAnimator";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
        <InternalToolsSection />
        <TechSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollAnimator />
    </>
  );
}
