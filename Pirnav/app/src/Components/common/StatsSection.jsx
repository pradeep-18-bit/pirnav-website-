import { useEffect, useMemo, useState } from "react";
import useRevealOnScroll from "./useRevealOnScroll";
import NetworkBackground from "./NetworkBackground";

const parseStatValue = (value) => {
  const stringValue = String(value ?? "");
  const numberValue = Number(stringValue.replace(/[^0-9.]/g, ""));
  const hasNumber = /\d/.test(stringValue) && Number.isFinite(numberValue);
  const suffix = hasNumber ? stringValue.replace(/[0-9.]/g, "") : "";

  return { numberValue: hasNumber ? numberValue : 0, suffix, hasNumber };
};

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

const StatCard = ({ value, label, delay = 0 }) => {
  const ref = useRevealOnScroll();
  const { numberValue, suffix, hasNumber } = useMemo(
    () => parseStatValue(value),
    [value]
  );
  const [displayValue, setDisplayValue] = useState(hasNumber ? 0 : value);

  useEffect(() => {
    if (!hasNumber) {
      setDisplayValue(value);
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(numberValue);
      return undefined;
    }

    let frameId;
    let startTime;
    const duration = 1200;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const startAnimation = () => {
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const nextValue = Math.round(numberValue * easeOutCubic(progress));
        setDisplayValue(nextValue);

        if (progress < 1) {
          frameId = window.requestAnimationFrame(step);
        }
      };

      frameId = window.requestAnimationFrame(step);
    };

    const delayId = window.setTimeout(startAnimation, delay);

    return () => {
      window.clearTimeout(delayId);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [delay, hasNumber, numberValue, value]);

  const renderedValue = hasNumber
    ? `${formatNumber(displayValue)}${suffix}`
    : value;

  return (
    <article
      ref={ref}
      className="stat-card reveal fade-up"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h2>{renderedValue}</h2>
      <p>{label}</p>
    </article>
  );
};

const StatsSection = ({ items, className = "" }) => {
  const ref = useRevealOnScroll();

  return (
    <section className={`section-block stats-section ${className}`.trim()}>
      <NetworkBackground />
      <div ref={ref} className="section-shell reveal fade-up">
        <div className="stats-grid">
          {items.map((item, index) => (
            <StatCard
              key={item.label}
              value={item.value}
              label={item.label}
              delay={index * 90}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
