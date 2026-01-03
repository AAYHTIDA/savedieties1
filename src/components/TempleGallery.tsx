import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";

const templeImages = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
];

const TempleGallery = () => {
  return (
    <section className="bg-dark-bg py-12 overflow-hidden">
      <div className="flex animate-marquee">
        {[...templeImages, ...templeImages].map((image, index) => (
          <img
            key={index}
            src={image}
            alt="Temple"
            className="w-48 h-36 object-cover mx-2 rounded-lg flex-shrink-0 hover:scale-105 transition-transform"
          />
        ))}
      </div>
    </section>
  );
};

export default TempleGallery;
