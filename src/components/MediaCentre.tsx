import { Button } from "@/components/ui/button";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";

const newsItems = [
  {
    image: news1,
    date: "December 28, 2020",
    title: "Malabar Devaswom Contribution ...",
    excerpt:
      "Malabar devaswom board Commissioner has issued a circular directing the temples under the Board to contribute fixed amounts to the 'Chief Minister's Disaster Relief Fund thereby forcefully making the temples to ...",
  },
  {
    image: news2,
    date: "December 28, 2020",
    title: "Chirakkadavu Temple Festival",
    excerpt:
      "The Deputy Superintendent of Police interfered with the conduct of Chirakkadavu Temple Festival in the name of maintenance of law and order as it was done in the last year creating trouble for the smooth conduct of ...",
  },
  {
    image: news3,
    date: "December 28, 2020",
    title: "Guruvayoor Devaswom Contributi...",
    excerpt:
      "Guruvayoor Devaswom board has decided to contribute Rs.10 Crores to the 'Chief Minister's Disaster Relief Fund and contributed the above amount in total violation of the provisions of the Guruvayoor Devaswom Act...",
  },
];

const MediaCentre = () => {
  return (
    <section className="bg-dark-bg py-20" id="media">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display text-primary-foreground text-center mb-4">
          Media Centre
        </h2>
        <div className="w-24 h-1 bg-saffron mx-auto mb-12" />

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {newsItems.map((item, index) => (
            <article
              key={index}
              className="bg-dark-card rounded-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-saffron text-sm mb-2">{item.date}</p>
                <h3 className="text-lg font-display text-primary-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-primary-foreground/60 text-sm mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                <a
                  href="#"
                  className="text-saffron text-sm font-medium hover:underline"
                >
                  Know More
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Button variant="saffronOutline" size="lg">
            View All
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MediaCentre;
