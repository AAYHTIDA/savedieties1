import { Button } from "@/components/ui/button";

const ContributeSection = () => {
  return (
    <section className="bg-dark-section py-20" id="contribute">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-display text-primary-foreground mb-6">
          Contribute
        </h2>
        <div className="w-24 h-1 bg-saffron mx-auto mb-8" />
        <p className="text-primary-foreground/80 max-w-3xl mx-auto text-lg mb-8 leading-relaxed">
          Your gift towards this good cause will go a long way in reviving properties that 
          belongs to Deities and bringing back the sanctity those sacred places deserve. So, 
          any small gift from your end will be treated like as seva to the Temple Hundi of 
          the Deities to take care of the Deities itself.
        </p>
        <Button variant="saffron" size="xl">
          Contribute
        </Button>
      </div>
    </section>
  );
};

export default ContributeSection;
