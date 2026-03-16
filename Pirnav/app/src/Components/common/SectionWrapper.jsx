import useRevealOnScroll from "./useRevealOnScroll";
import NetworkBackground from "./NetworkBackground";

const SectionWrapper = ({
  eyebrow,
  title,
  description,
  children,
  className = "",
  contentClassName = "",
  align = "left",
  id,
}) => {
  const ref = useRevealOnScroll();

  return (
    <section id={id} className={`section-block ${className}`.trim()}>
      <NetworkBackground />
      <div ref={ref} className="section-shell reveal fade-up">
        {(eyebrow || title || description) && (
          <div className={`section-heading section-heading-${align}`}>
            {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        <div className={contentClassName}>{children}</div>
      </div>
    </section>
  );
};

export default SectionWrapper;
