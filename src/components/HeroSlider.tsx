import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroTemple1 from "@/assets/hero-temple-1.jpg";
import heroTemple2 from "@/assets/hero-temple-2.jpg";
import heroTemple3 from "@/assets/hero-temple-3.jpg";

const slides = [
  {
    image: heroTemple1,
    title: "Saketham Hindu Litigants Trust",
    subtitle: "We ensure that all the properties that belongs to the Deities are not mismanaged, encroached or misused.",
  },
  {
    image: heroTemple2,
    title: "Saketham Hindu Litigants Trust",
    subtitle: "We ensure that all the properties that belongs to the Deities are not mismanaged, encroached or misused.",
  },
  {
    image: heroTemple3,
    title: "Saketham Hindu Litigants Trust",
    subtitle: "We ensure that all the properties that belongs to the Deities are not mismanaged, encroached or misused.",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-bg/90" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-dark-bg/95 py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-display text-primary-foreground mb-4">
            {slides[currentSlide].title}
          </h1>
          <p className="text-primary-foreground/80 max-w-3xl mx-auto text-lg">
            {slides[currentSlide].subtitle}
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
      >
        <ChevronRight className="w-10 h-10" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-saffron w-6" : "bg-primary-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
