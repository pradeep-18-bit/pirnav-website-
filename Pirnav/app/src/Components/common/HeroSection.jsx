import { Link } from "react-router-dom";

const HeroSection = ({
  image,
  images = [],
  activeIndex = 0,
  imageAlt = "Page hero",
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  children,
  onMouseEnter,
  onMouseLeave,
  className = "",
}) => {
  const backgroundImages = images.length > 0 ? images : image ? [image] : [];

  return (
    <section
      className={`hero-section fade-up ${className}`.trim()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="hero-bg">
        <div className="hero-pattern" />
        {backgroundImages.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt={index === activeIndex ? imageAlt : ""}
            aria-hidden={index !== activeIndex}
            className={`hero-bg-image${index === activeIndex ? " hero-bg-image-active" : ""}`}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      <div className="container hero-content">
        {eyebrow && <span className="section-eyebrow section-eyebrow-light">{eyebrow}</span>}
        {title && <h1>{title}</h1>}
        {breadcrumbs.length > 0 && (
          <div className="breadcrumb-row">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`}>
                {index > 0 && <span className="breadcrumb-separator">/</span>}
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
              </span>
            ))}
          </div>
        )}
        {description && <p>{description}</p>}
        {children}
      </div>
    </section>
  );
};

export default HeroSection;
