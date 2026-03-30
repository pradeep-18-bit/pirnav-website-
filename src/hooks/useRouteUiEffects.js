import { useEffect, useLayoutEffect } from "react";

export const useRouteUiEffects = (location) => {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = prefersReducedMotion ? "auto" : "smooth";

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior });

      const scrollTargets = new Set([
        document.scrollingElement,
        document.documentElement,
        document.body,
      ]);

      document
        .querySelectorAll(
          "[data-scroll-container], .main-content, .page-shell, .site-content, .app-layout"
        )
        .forEach((element) => scrollTargets.add(element));

      document.querySelectorAll("body *").forEach((element) => {
        const style = window.getComputedStyle(element);
        const isScrollableY =
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          element.scrollHeight > element.clientHeight;

        if (isScrollableY) {
          scrollTargets.add(element);
        }
      });

      scrollTargets.forEach((element) => {
        if (!element) return;
        try {
          element.scrollTo({ top: 0, left: 0, behavior: "auto" });
        } catch {
          element.scrollTop = 0;
          element.scrollLeft = 0;
        }
      });
    };

    resetScroll();
    const frameId = window.requestAnimationFrame(resetScroll);

    return () => window.cancelAnimationFrame(frameId);
  }, [location.key, location.pathname, location.search]);

  useEffect(() => {
    const selector = [
      ".reveal",
      ".stat-card",
      ".service-box",
      ".card",
      ".tile",
      ".executive-grid > div",
      ".story-card",
      ".career-card",
      ".job-card-modern",
      ".contact-card",
      ".contact-form-card",
      ".job-detail-card",
      ".service-outline-card",
      ".enterprise-service-card",
      ".homepage-why-item",
      ".feature-card",
      ".testimonial-card",
      ".service-card-modern",
      ".service-card-link",
      ".technology-card",
      ".enterprise-careers-panel",
      ".cta-panel",
      ".map-frame",
      ".hero-metric",
    ].join(", ");

    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => element.classList.add("reveal"));

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("active"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active", "visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [location.pathname]);
};
