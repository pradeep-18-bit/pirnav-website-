import { Link } from "react-router-dom";
import { Facebook, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import logo from "../../assets/image.png";
import { company, footerSections } from "../../data/siteContent";

const socialIcons = {
  LinkedIn: Linkedin,
  Facebook: Facebook,
};

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div className="footer-brand">
          <div className="brand-mark footer-brand-mark">
            <img src={logo} alt="Pirnav logo" loading="lazy" />
            <div>
              <strong>{company.shortName}</strong>
              <span>Software Solutions</span>
            </div>
          </div>
          <p>{company.description}</p>
          <div className="footer-link-stack">
            {footerSections.company.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h3>Services</h3>
          {footerSections.services.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h3>Resources</h3>
          {footerSections.resources.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h3>Contact</h3>
          <a href={`tel:${company.phone}`} className="footer-contact-item">
            <Phone size={16} />
            {company.phone}
          </a>
          <a href={`mailto:${company.email}`} className="footer-contact-item">
            <Mail size={16} />
            {company.email}
          </a>
          <div className="footer-contact-item">
            <MapPin size={16} />
            {company.location}
          </div>
          <div className="footer-socials">
            {footerSections.socials.map((social) => {
              const Icon = socialIcons[social.label];

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                >
                  {Icon ? <Icon size={18} /> : social.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="section-shell footer-bottom-inner">
          <span>(c) 2026 {company.name}. All rights reserved.</span>
          <span>Built for a modern enterprise web experience.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
