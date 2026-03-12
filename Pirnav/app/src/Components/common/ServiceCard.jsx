import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import useRevealOnScroll from "./useRevealOnScroll";

const ServiceCard = ({
  title,
  description,
  image,
  to,
  icon: Icon,
  highlights = [],
  delay = 0,
}) => {
  const ref = useRevealOnScroll();

  return (
    <Link
      to={to}
      ref={ref}
      className="service-card-link service-card-modern reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="service-card-media">
        <img src={image} alt={title} loading="lazy" />
      </div>
      <div className="service-card-body">
        <div className="service-card-head">
          <div className="feature-icon">{Icon && <Icon size={22} />}</div>
          <ArrowRight size={18} className="service-card-arrow" />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        {highlights.length > 0 && (
          <div className="tag-row">
            {highlights.map((highlight) => (
              <span key={highlight} className="mini-tag">
                {highlight}
              </span>
            ))}
          </div>
        )}
        <span className="button button-ghost button-md service-card-button">
          Learn more
        </span>
      </div>
    </Link>
  );
};

export default ServiceCard;
