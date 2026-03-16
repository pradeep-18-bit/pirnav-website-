import HeroSection from "./HeroSection";

const ServiceHero = ({ title, description, image, breadcrumbs = [], eyebrow = "Service" }) => {
  return (
    <HeroSection
      image={image}
      imageAlt={title}
      eyebrow={eyebrow}
      title={title}
      description={description}
      breadcrumbs={breadcrumbs}
    />
  );
};

export default ServiceHero;
