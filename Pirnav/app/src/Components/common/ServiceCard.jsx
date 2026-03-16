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
      ref={ref}
      to={to}
      className="service-card service-card-link reveal reveal-card"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="service-card-media">
        <img src={image} alt={title} loading="lazy" />
      </div>
      <div className="service-card-body">
        <div className="service-card-head">
          <div className="service-icon icon">{Icon && <Icon size={22} />}</div>
          <h3>{title}</h3>
        </div>
        <p className="service-description">{description}</p>
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
