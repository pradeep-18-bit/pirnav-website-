import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, Building2, CheckCircle2, Cloud, Database, MonitorSmartphone, ShieldCheck, Users, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import CTASection from "../../components/common/CTASection";
import SectionWrapper from "../../components/common/SectionWrapper";
import StatsSection from "../../components/common/StatsSection";

const slides = [
  {
    tag: "Enterprise Technology Consulting",
    title: "Engineering scalable software platforms.",
    description:
      "We help enterprises modernize technology, accelerate delivery, and scale digital products with reliable engineering support.",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=3840",
  },
  {
    tag: "Cloud and Platform Modernization",
    title: "Cloud and data solutions for modern businesses.",
    description:
      "Deliver reliable infrastructure, stronger platform operations, and intelligent platforms built for sustainable growth.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=3840",
  },
  {
    tag: "Consulting Led Delivery",
    title: "Consulting and engineering teams that deliver results.",
    description:
      "Partner with experienced engineers building enterprise solutions with execution discipline and measurable outcomes.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=3840",
  },
  {
    tag: "Cloud Operations and Insights",
    title: "Cloud infrastructure visibility for resilient delivery.",
    description:
      "Strengthen platform operations with clearer infrastructure insight, better monitoring, and scalable cloud foundations.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=3840",
  },
];

const services = [
  {
    icon: MonitorSmartphone,
    title: "Software Engineering",
    description:
      "Build reliable digital products and modernize applications across enterprise web, mobile, and platform ecosystems.",
  },
  {
    icon: Cloud,
    title: "Cloud Engineering",
    description:
      "Design resilient cloud environments, streamline migration programs, and improve operational scalability.",
  },
  {
    icon: Database,
    title: "Data & AI",
    description:
      "Create data foundations that improve reporting, analytics, and decision-making across the business.",
  },
  {
    icon: Building2,
    title: "Enterprise Applications",
    description:
      "Support core enterprise platforms with implementation, integration, enhancement, and long-term optimization.",
  },
  {
    icon: Briefcase,
    title: "Technology Consulting",
    description:
      "Align technology planning, staffing, and program execution around measurable business priorities.",
  },
  {
    icon: Workflow,
    title: "Digital Transformation",
    description:
      "Guide modernization initiatives with a practical consulting-led delivery model for complex organizations.",
  },
];

const heroStats = [
  { value: "9+", label: "Service Lines" },
  { value: "39+", label: "Client Engagements" },
  { value: "4", label: "Global Delivery Locations" },
];

const strengths = [
  {
    title: "Enterprise engineering expertise",
  },
  {
    title: "Scalable delivery teams",
  },
  {
    title: "Cloud and data specialization",
  },
  {
    title: "Proven consulting-led delivery model",
  },
];

const Dashboard = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="page-shell">
      <section className="hero-section homepage-hero">
        <div className="hero-noise" />
        <div
          className="section-shell hero-slider homepage-hero-shell"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="slider-container">
            {slides.map((slide, index) => {
              const isActive = index === activeSlide;

              return (
                <article
                  key={slide.title}
                  className={`hero-slide ${isActive ? "hero-slide-active" : ""}`}
                  style={{ "--hero-image": `url(${slide.image})` }}
                  aria-hidden={!isActive}
                >
                  <div className="hero-slide-copy homepage-hero-copy">
                    {isActive && (
                      <>
                        <span className="section-eyebrow">{slide.tag}</span>
                        <h1>{slide.title}</h1>
                        <p>{slide.description}</p>
                        <div className="hero-actions">
                          <Button to="/services">
                            Explore Services
                            <ArrowRight size={18} />
                          </Button>
                          <Button to="/contact" variant="secondary">
                            Contact Us
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="hero-slide-spacer" aria-hidden="true" />
                  <div className="hero-slide-overlay" />
                </article>
              );
            })}
          </div>

          <div className="hero-slider-dots" aria-label="Hero slide navigation">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={`hero-slider-dot ${index === activeSlide ? "hero-slider-dot-active" : ""}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="executive-section">
        <div className="container">
          <div className="executive-grid">
            <div className="executive-left">
              <h2>Executive summary about Pirnav Software Solutions</h2>
            </div>

            <div className="executive-right">
              <p>
                Pirnav Software Solutions provides on-demand tech resources to fuel your
                projects, both short-term and long-term. Our team of seasoned professionals
                across various technologies can seamlessly integrate into your existing
                workflow, delivering the expertise you need, when you need it.
              </p>

              <Link to="/about" className="primary-btn">
                Pirnav Software Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatsSection items={heroStats} className="homepage-stats section-surface-muted" />

      <SectionWrapper
        className="section-surface-white"
        eyebrow="Services"
        title="Core services for enterprise software, platforms, and transformation programs."
        description="The homepage is focused on essential consulting capabilities and a cleaner enterprise technology narrative."
      >
        <div className="enterprise-services-grid">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="enterprise-service-card reveal is-visible"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <div className="feature-icon">
                  <Icon size={22} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="section-surface-muted"
        eyebrow="Why Choose Us"
        title="Why companies work with us."
        description="We combine consulting discipline, engineering depth, and delivery accountability to help organizations modernize technology without unnecessary complexity."
      >
        <div className="homepage-why-layout">
          <div className="homepage-why-copy">
            <p className="homepage-why-intro">
              Our teams support modernization programs across software platforms,
              cloud environments, enterprise applications, and data ecosystems with a
              delivery model designed for measurable outcomes.
            </p>
            <div className="homepage-why-list">
              {strengths.map((item, index) => (
                <article
                  key={item.title}
                  className="homepage-why-item reveal is-visible"
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <CheckCircle2 size={20} />
                  <span>{item.title}</span>
                </article>
              ))}
            </div>
            <div className="hero-actions homepage-why-actions">
              <Button to="/about" variant="secondary">
                Learn More
              </Button>
              <Button to="/contact">Talk to Our Team</Button>
            </div>
          </div>

          <div className="homepage-why-media">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=3840&q=90"
              alt="Consulting team collaborating around enterprise planning dashboards"
              loading="lazy"
            />
            <div className="homepage-why-overlay" />
          </div>
        </div>
      </SectionWrapper>

      <CTASection
        className="homepage-cta-banner"
        eyebrow="Start a Conversation"
        title="Ready to build scalable technology platforms?"
        description="Partner with engineering and consulting teams focused on modernization, delivery quality, and long-term business impact."
        primaryAction={{ to: "/contact", label: "Start a Conversation" }}
        secondaryAction={{ to: "/services", label: "Explore Services" }}
      />

      <SectionWrapper
        className="section-surface-muted"
        eyebrow="Careers"
        title="Join our engineering teams."
        description="Work on enterprise software, cloud modernization, and consulting-led delivery programs with teams that value quality and accountability."
      >
        <div className="enterprise-careers-panel">
          <div>
            <h3>Build your career through real delivery work and long-term technology partnerships.</h3>
            <p>
              Explore open roles across software engineering, QA, support, and enterprise technology consulting.
            </p>
          </div>
          <Button to="/careers">View Open Roles</Button>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Dashboard;
