import { Button } from "@/components/ui/button";
import templeAbout from "@/assets/temple-about.jpg";

const AboutSection = () => {
  return (
    <section className="bg-dark-bg py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src={templeAbout}
              alt="Hindu Temple"
              className="w-full h-[400px] object-cover rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-saffron rounded-full flex items-center justify-center">
              <span className="text-3xl font-display text-primary-foreground">ॐ</span>
            </div>
          </div>

          {/* Content */}
          <div className="text-primary-foreground">
            <p className="text-lg leading-relaxed mb-6">
              Legally, Hindu Deities are considered to be a perpetual minor, and hence their 
              properties cannot be transferred to anyone else. The goal of Saketham Hindu 
              Litigants Trust is to ensure that all the properties that belong to the Deities 
              are not mismanaged, encroached or misused and also assist with the well-being 
              of Hindus including conducting cases related to Hindu society and religion, both 
              spiritual and material including temple-related issues both legal and allied.
            </p>
            <Button variant="saffron" size="lg">
              Know More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
