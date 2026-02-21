import { useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "./Logo";
import { Button } from "./Button";
import styles from "../../styles/components/MobileNav.module.css";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#trip-ticket", label: "Our Process" },
  { href: "#showcase", label: "Showcase" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const menuContent = (
    <div
      className={styles.overlay}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className={styles.overlayInner}>
        <button
          onClick={() => setIsOpen(false)}
          className={styles.closeButton}
          aria-label="Close menu"
        >
          <svg
            className={styles.closeIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className={styles.logoWrapper}>
          <Logo variant="full" color="yellow" className={styles.logoSvg} />
        </div>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={styles.navLink}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.ctaWrapper}>
          <a href="#contact" onClick={() => setIsOpen(false)} className={styles.ctaLink}>
            <Button variant="primary" size="md" className={styles.ctaButton}>
              Get Started
            </Button>
          </a>
        </div>

        <div className={styles.contactInfo}>
          <p className={styles.contactLine}>
            <span className={styles.contactLabel}>Phone:</span> (+20) 109 258 0008
          </p>
          <p className={styles.contactLine}>
            (+20) 107 004 0076
          </p>
          <p className={styles.contactLine}>
            (+971) 527 756 568
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.hamburger}
        aria-label="Toggle menu"
      >
        <span
          className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineTopOpen : ""}`}
        />
        <span
          className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineMidOpen : ""}`}
        />
        <span
          className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineBotOpen : ""}`}
        />
      </button>

      {createPortal(menuContent, document.body)}
    </>
  );
}

export default MobileNav;
