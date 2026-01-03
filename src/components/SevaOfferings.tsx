import { Shield, Home, Scale } from "lucide-react";

const offerings = [
  {
    icon: Home,
    title: "Streamline Temple Administration",
    description:
      "Help and support all the Devaswom administrations and its functionaries of the Hindu temples to protect and preserve the properties.",
  },
  {
    icon: Shield,
    title: "Safeguard the Adobe of Deities",
    description:
      "Secure and safeguard the adobes of the deities from alienations and attachments by any individuals, firms, corporations, groups, etc with an arriere-pensee.",
  },
  {
    icon: Scale,
    title: "Legal Assistance",
    description:
      "Legally stand behind for the well being of the Hindus including conducting cases relating to Hindu society, religion both spiritual and material including temple related issues both legal and allied.",
  },
];

const SevaOfferings = () => {
  return (
    <section className="bg-dark-section py-20" id="seva">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display text-primary-foreground text-center mb-4">
          Our Seva Offerings
        </h2>
        <div className="w-24 h-1 bg-saffron mx-auto mb-12" />

        <div className="grid md:grid-cols-3 gap-8">
          {offerings.map((offering, index) => (
            <div
              key={index}
              className="bg-dark-card p-8 rounded-lg text-center hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-saffron rounded-full flex items-center justify-center mx-auto mb-6">
                <offering.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display text-primary-foreground mb-4">
                {offering.title}
              </h3>
              <p className="text-primary-foreground/70 leading-relaxed">
                {offering.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SevaOfferings;
