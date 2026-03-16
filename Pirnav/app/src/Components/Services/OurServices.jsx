import HeroSection from "../../components/common/HeroSection";
import SectionWrapper from "../../components/common/SectionWrapper";
import ServiceCard from "../../components/common/ServiceCard";
import CTASection from "../../components/common/CTASection";
import { serviceItems } from "../../data/siteContent";

const PublicServices = () => {
  return (
    <div className="page-shell">
      <HeroSection
        image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2400&q=85"
        imageAlt="Pirnav services"
        eyebrow="Services"
        title="Our Technology Services"
        description="We help enterprises design, build, and scale reliable technology platforms across engineering, cloud, data, and business-critical systems."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Services" }]}
      />

      <SectionWrapper
        className="section-surface-white"
        eyebrow="Service Catalog"
        title="Capabilities built for enterprise technology delivery."
        description="Explore consulting and engineering services structured to support modernization, platform scale, and long-term operational reliability."
      >
        <div className="service-grid">
          {serviceItems.map((service, index) => (
            <ServiceCard
              key={service.slug}
              title={service.title}
              description={service.summary}
              image={service.image}
              icon={service.icon}
              highlights={service.highlights}
              to={`/services/${service.slug}`}
              delay={index * 70}
            />
          ))}
        </div>
      </SectionWrapper>

      <CTASection
        className="internal-page-cta"
        eyebrow="Start a Conversation"
        title="Ready to start your next project with us?"
        description="Talk to our team about application delivery, cloud modernization, enterprise systems, or staffing support."
        primaryAction={{ label: "Start a Conversation", to: "/contact" }}
        secondaryAction={{ label: "About Pirnav", to: "/about" }}
      />
    </div>
  );
};

export default PublicServices;
