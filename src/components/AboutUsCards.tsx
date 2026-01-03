import { ArrowRight } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";
import aboutHistory from "@/assets/about-history.jpg";
import aboutLegal from "@/assets/about-legal.jpg";

const cards = [
  {
    image: aboutTeam,
    title: "Organizing Team",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
  },
  {
    image: aboutHistory,
    title: "Historical Significance",
    description:
      "The concept of Save the Deities has originated from the deplorable situation that exists in the State of Kerala with regard to the Hindu Temples and its administration. Prior to the independence, the geographical area…",
  },
  {
    image: aboutLegal,
    title: "Legal Significance",
    description:
      "In India, the deity is legally considered as a perpetual minor. The concept of perpetual minor was originated taking into consideration of the fact that the deity is not in a position to come out of the temple and…",
  },
];

const AboutUsCards = () => {
  return (
    <section className="bg-dark-bg py-20" id="about">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display text-primary-foreground text-center mb-4">
          About Us
        </h2>
        <div className="w-24 h-1 bg-saffron mx-auto mb-12" />

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <article
              key={index}
              className="group relative overflow-hidden rounded-lg"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-display text-primary-foreground mb-3">
                  {card.title}
                </h3>
                <p className="text-primary-foreground/70 text-sm mb-4 line-clamp-3">
                  {card.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-saffron text-primary-foreground hover:bg-saffron-dark transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsCards;
