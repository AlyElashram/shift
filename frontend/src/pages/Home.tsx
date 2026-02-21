import { useState, useEffect } from 'react';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { MobileNav } from '../components/ui/MobileNav';
import { ContactForm } from '../components/ui/ContactForm';
import { getPublicShowcases } from '../api/showcases';
import styles from '../styles/pages/Home.module.css';

interface ShowcaseCar {
  id: string;
  image: string;
  model: string;
  year: string;
  origin: string;
}

const services = [
  {
    icon: 'EGP',
    title: 'Egypt Import',
    description:
      'Seamless car imports to Egypt with full customs clearance and documentation support.',
  },
  {
    icon: 'UAE',
    title: 'UAE Sourcing',
    description:
      'Access to premium vehicles from UAE markets with verified inspection reports.',
  },
];

const processSteps = [
  { step: '01', title: 'Select Your Vehicle', description: 'Browse and choose from verified listings' },
  { step: '02', title: 'Create Trip Ticket', description: 'Initialize your import with full documentation' },
  { step: '03', title: 'Track Progress', description: 'Real-time updates from purchase to delivery' },
  { step: '04', title: 'Receive Your Car', description: 'Customs cleared and delivered to your door' },
];

export default function Home() {
  const [showcaseCars, setShowcaseCars] = useState<ShowcaseCar[]>([]);

  useEffect(() => {
    getPublicShowcases()
      .then((data) => {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        setShowcaseCars(Array.isArray(parsed) ? parsed : []);
      })
      .catch(() => setShowcaseCars([]));
  }, []);

  return (
    <div className={`${styles.page} grain-overlay`}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Logo variant="full" color="yellow" className={styles.navLogo} />

          <div className={styles.desktopNav}>
            <a href="#services" className={styles.navLink}>Services</a>
            <a href="#trip-ticket" className={styles.navLink}>Our Process</a>
            <a href="#showcase" className={styles.navLink}>Showcase</a>
            <a href="#contact">
              <Button variant="primary" size="sm">Get Started</Button>
            </a>
          </div>

          <MobileNav />
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGlowLeft} />
        <div className={styles.heroGlowRight} />

        <div className={styles.heroContent}>
          <div className="animate-slide-up">
            <Logo variant="full" color="yellow" className={styles.heroLogo} />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h1 className={styles.heroTitle}>
              Premium Car
              <br />
              <span className="text-gradient">Import Service</span>
            </h1>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <p className={styles.heroSubtitle}>
              Bringing your dream cars from the{' '}
              <span className={styles.heroHighlight}>UAE</span> to Egypt
              with our seamless Trip Ticket system.
            </p>
          </div>

          <div className={`animate-slide-up ${styles.heroCta}`} style={{ animationDelay: '0.4s' }}>
            <a href="#contact">
              <Button variant="primary" size="lg" className={styles.heroCtaButton}>
                Start Your Trip Ticket
              </Button>
            </a>
            <a href="#trip-ticket">
              <Button variant="secondary" size="lg" className={styles.heroCtaButton}>
                Learn More
              </Button>
            </a>
          </div>
        </div>

        <a href="#services" className={`${styles.scrollIndicator} animate-bounce`} aria-label="Scroll to services">
          <svg className={styles.scrollIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.services}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTag}>What We Offer</p>
            <h2 className={styles.sectionTitle}>Our Services</h2>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <span className={styles.serviceIconText}>{service.icon}</span>
                </div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trip Ticket Section */}
      <section id="trip-ticket" className={styles.tripTicket}>
        <div className={styles.sectionContainer}>
          <div className={styles.tripTicketGrid}>
            <div className={styles.tripTicketInfo}>
              <p className={styles.sectionTag}>Our Process</p>
              <h2 className={styles.sectionTitle}>
                Trip Ticket
                <br />
                <span className={styles.tripTicketAccent}>System</span>
              </h2>
              <p className={styles.tripTicketDescription}>
                Our proprietary Trip Ticket system tracks your vehicle from
                source to destination, providing real-time updates and complete
                transparency throughout the import process.
              </p>

              <div className={styles.stepsContainer}>
                {processSteps.map((item, index) => (
                  <div key={index} className={styles.stepItem}>
                    <div className={styles.stepNumber}>
                      <span className={styles.stepNumberText}>{item.step}</span>
                    </div>
                    <div>
                      <h4 className={styles.stepTitle}>{item.title}</h4>
                      <p className={styles.stepDescription}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.tripTicketMockupWrapper}>
              <div className={`${styles.tripTicketMockup} glow-yellow`}>
                <div className={styles.mockupInner}>
                  <Logo variant="compact" color="yellow" className={styles.mockupLogo} />
                  <div className={styles.mockupContent}>
                    <p className={styles.mockupLabel}>Trip Ticket</p>
                    <p className={styles.mockupNumber}>#0001</p>
                    <div className={styles.mockupDetails}>
                      <div className={styles.mockupRow}>
                        <span className={styles.mockupRowLabel}>Status</span>
                        <span className={styles.mockupRowValueYellow}>In Transit</span>
                      </div>
                      <div className={styles.mockupRow}>
                        <span className={styles.mockupRowLabel}>Origin</span>
                        <span className={styles.mockupRowValue}>Dubai, UAE</span>
                      </div>
                      <div className={styles.mockupRow}>
                        <span className={styles.mockupRowLabel}>Destination</span>
                        <span className={styles.mockupRowValue}>Cairo, EGP</span>
                      </div>
                      <div className={styles.mockupProgressTrack}>
                        <div className={styles.mockupProgressFill} />
                      </div>
                      <p className={styles.mockupProgressLabel}>67% Complete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className={styles.showcase}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTag}>Our Track Record</p>
            <h2 className={styles.sectionTitle}>Successfully Imported</h2>
          </div>

          <div className={styles.showcaseGrid}>
            {showcaseCars.map((car) => (
              <div key={car.id} className={styles.showcaseCard}>
                <div className={styles.showcaseImageContainer}>
                  {car.image ? (
                    <img
                      src={car.image}
                      alt={`${car.model} ${car.year}`}
                      className={styles.showcaseImage}
                    />
                  ) : (
                    <div className={styles.showcasePlaceholder}>
                      <svg className={styles.showcasePlaceholderIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className={styles.showcasePlaceholderText}>{car.model}</p>
                    </div>
                  )}
                </div>

                <div className={styles.showcaseOverlay}>
                  <p className={styles.showcaseMeta}>
                    {car.year} &bull; {car.origin}
                  </p>
                  <h3 className={styles.showcaseModel}>{car.model}</h3>
                </div>

                <div className={styles.showcaseBadge}>Delivered</div>
              </div>
            ))}
          </div>

          <div className={styles.showcaseFooter}>
            <p className={styles.showcaseFooterText}>
              Join our growing list of satisfied customers
            </p>
            <a href="#contact" className={styles.showcaseFooterLink}>
              Start Your Import
              <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contact}>
        <div className={styles.sectionContainer}>
          <div className={styles.contactGrid}>
            <div>
              <p className={styles.sectionTag}>Get In Touch</p>
              <h2 className={styles.sectionTitle}>
                Start Your
                <br />
                <span className="text-gradient">Journey Today</span>
              </h2>
              <p className={styles.contactDescription}>
                Ready to import your dream car? Fill out the form and our team
                will get back to you.
              </p>

              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrapper}>
                    <svg className={styles.contactIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className={styles.contactItemLabel}>Phone</p>
                    <p className={styles.contactItemValue}>(+20) 109 258 0008</p>
                    <p className={styles.contactItemValue}>(+20) 107 004 0076</p>
                    <p className={styles.contactItemValue}>(+971) 527 756 568</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrapper}>
                    <svg className={styles.contactIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className={styles.contactItemLabel}>Location</p>
                    <a
                      href="https://maps.app.goo.gl/XHUgEiupFn3ykyFS6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactItemLink}
                    >
                      Building 81, South Lotus, New Cairo
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.sectionContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <Logo variant="full" color="yellow" className={styles.footerLogo} />
              <p className={styles.footerDescription}>
                Premium car import service bringing the finest vehicles from the
                UAE to Egypt.
              </p>
              <a
                href="https://maps.app.goo.gl/XHUgEiupFn3ykyFS6"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerAddress}
              >
                Building 81, South Lotus
                <br />
                New Cairo, Egypt
              </a>
            </div>

            <div>
              <h4 className={styles.footerHeading}>Quick Links</h4>
              <ul className={styles.footerLinks}>
                {['Services', 'Trip Ticket', 'Showcase', 'Contact'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(' ', '-')}`}
                      className={styles.footerLink}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={styles.footerHeading}>Contact</h4>
              <ul className={styles.footerContactList}>
                <li className={styles.footerContactItem}>
                  <span className={styles.footerContactLabel}>Phone:</span>{' '}
                  (+20) 109 258 0008
                </li>
                <li className={styles.footerContactItem}>(+20) 107 004 0076</li>
                <li className={styles.footerContactItem}>(+971) 527 756 568</li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}>
              &copy; {new Date().getFullYear()} SHIFT By Joe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
