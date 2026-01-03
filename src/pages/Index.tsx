import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import QuoteSection from "@/components/QuoteSection";
import AboutSection from "@/components/AboutSection";
import SevaOfferings from "@/components/SevaOfferings";
import MediaCentre from "@/components/MediaCentre";
import CourtCases from "@/components/CourtCases";
import TempleGallery from "@/components/TempleGallery";
import ContributeSection from "@/components/ContributeSection";
import AboutUsCards from "@/components/AboutUsCards";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSlider />
        <QuoteSection />
        <AboutSection />
        <SevaOfferings />
        <MediaCentre />
        <CourtCases />
        <TempleGallery />
        <ContributeSection />
        <AboutUsCards />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
