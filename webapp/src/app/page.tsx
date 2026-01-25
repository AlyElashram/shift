import { Logo, Button, MobileNav } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--shift-black)] grain-overlay">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 bg-[var(--shift-black)]/80 backdrop-blur-md border-b border-[var(--shift-black-muted)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo variant="full" color="yellow" className="h-6 sm:h-8 w-auto" />

          {/* Desktop Nav - hidden on mobile */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="#services"
              className="text-[var(--shift-cream)] hover:text-[var(--shift-yellow)] transition-colors text-sm uppercase tracking-wider"
            >
              Services
            </a>
            <a
              href="#trip-ticket"
              className="text-[var(--shift-cream)] hover:text-[var(--shift-yellow)] transition-colors text-sm uppercase tracking-wider"
            >
              Trip Ticket
            </a>
            <a
              href="#contact"
              className="text-[var(--shift-cream)] hover:text-[var(--shift-yellow)] transition-colors text-sm uppercase tracking-wider"
            >
              Contact
            </a>
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Nav */}
          <MobileNav />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--shift-black)] via-[var(--shift-black-soft)] to-[var(--shift-black)]" />

        {/* Yellow glow accent */}
        <div className="absolute top-1/4 -left-32 w-64 sm:w-96 h-64 sm:h-96 bg-[var(--shift-yellow)] rounded-full blur-[150px] sm:blur-[200px] opacity-20" />
        <div className="absolute bottom-1/4 -right-32 w-48 sm:w-64 h-48 sm:h-64 bg-[var(--shift-yellow)] rounded-full blur-[100px] sm:blur-[150px] opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          <div className="animate-slide-up">
            <Logo variant="full" color="yellow" className="h-12 sm:h-16 md:h-20 w-auto mx-auto mb-6 sm:mb-8" />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <p className="text-[var(--shift-gray-light)] text-sm sm:text-lg md:text-xl tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-4 sm:mb-6">
              Quick &bull; Smart &bull; Vivide
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-[var(--shift-cream)] text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-none mb-6 sm:mb-8">
              Premium Car
              <br />
              <span className="text-gradient">Import Service</span>
            </h1>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-[var(--shift-gray-light)] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
              Bringing your dream cars from{" "}
              <span className="text-[var(--shift-yellow)]">UAE</span> &{" "}
              <span className="text-[var(--shift-yellow)]">Qatar</span> to Egypt
              with our seamless Trip Ticket system.
            </p>
          </div>

          <div
            className="animate-slide-up flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            style={{ animationDelay: "0.4s" }}
          >
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Start Your Trip Ticket
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>

        {/* Scroll indicator - hidden on very small screens */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <svg
            className="w-6 h-6 text-[var(--shift-gray)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[var(--shift-yellow)] uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4">
              What We Offer
            </p>
            <h2 className="text-[var(--shift-cream)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase">
              Our Services
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: "EGP",
                title: "Egypt Import",
                description:
                  "Seamless car imports to Egypt with full customs clearance and documentation support.",
              },
              {
                icon: "UAE",
                title: "UAE Sourcing",
                description:
                  "Access to premium vehicles from UAE markets with verified inspection reports.",
              },
              {
                icon: "QAT",
                title: "Qatar Sourcing",
                description:
                  "Exclusive access to Qatar's luxury car market with end-to-end handling.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="card group hover:border-[var(--shift-yellow)] transition-all"
              >
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-[var(--shift-yellow)]/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[var(--shift-yellow)]/20 transition-colors">
                  <span className="text-[var(--shift-yellow)] font-bold text-lg sm:text-xl">
                    {service.icon}
                  </span>
                </div>
                <h3 className="text-[var(--shift-cream)] text-lg sm:text-xl font-bold uppercase mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-[var(--shift-gray-light)] text-sm sm:text-base">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trip Ticket Section */}
      <section
        id="trip-ticket"
        className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--shift-black-muted)]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-[var(--shift-yellow)] uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4">
                Our Process
              </p>
              <h2 className="text-[var(--shift-cream)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase mb-4 sm:mb-6">
                Trip Ticket
                <br />
                <span className="font-accent text-[var(--shift-yellow)] normal-case">
                  System
                </span>
              </h2>
              <p className="text-[var(--shift-gray-light)] text-base sm:text-lg mb-6 sm:mb-8">
                Our proprietary Trip Ticket system tracks your vehicle from
                source to destination, providing real-time updates and complete
                transparency throughout the import process.
              </p>

              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    step: "01",
                    title: "Select Your Vehicle",
                    description: "Browse and choose from verified listings",
                  },
                  {
                    step: "02",
                    title: "Create Trip Ticket",
                    description: "Initialize your import with full documentation",
                  },
                  {
                    step: "03",
                    title: "Track Progress",
                    description: "Real-time updates from purchase to delivery",
                  },
                  {
                    step: "04",
                    title: "Receive Your Car",
                    description: "Customs cleared and delivered to your door",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 sm:gap-4 items-start">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded bg-[var(--shift-yellow)] flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--shift-black)] font-bold text-xs sm:text-sm">
                        {item.step}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[var(--shift-cream)] font-bold uppercase mb-1 text-sm sm:text-base">
                        {item.title}
                      </h4>
                      <p className="text-[var(--shift-gray-light)] text-xs sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              {/* Trip ticket mockup */}
              <div className="aspect-[3/4] max-w-sm mx-auto lg:max-w-none bg-gradient-to-br from-[var(--shift-black)] to-[var(--shift-black-muted)] rounded-lg border border-[var(--shift-gray)] p-6 sm:p-8 glow-yellow">
                <div className="h-full flex flex-col">
                  <Logo variant="compact" color="yellow" className="h-5 sm:h-6 w-auto mb-6 sm:mb-8" />
                  <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <p className="text-[var(--shift-gray)] text-xs uppercase tracking-widest mb-2">
                      Trip Ticket
                    </p>
                    <p className="text-[var(--shift-yellow)] text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                      #0001
                    </p>
                    <div className="w-full max-w-xs space-y-2 sm:space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-[var(--shift-gray)]">Status</span>
                        <span className="text-[var(--shift-yellow)]">In Transit</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-[var(--shift-gray)]">Origin</span>
                        <span className="text-[var(--shift-cream)]">Dubai, UAE</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-[var(--shift-gray)]">Destination</span>
                        <span className="text-[var(--shift-cream)]">Cairo, EGP</span>
                      </div>
                      <div className="h-2 bg-[var(--shift-black)] rounded-full mt-4 sm:mt-6 overflow-hidden">
                        <div className="h-full w-2/3 bg-[var(--shift-yellow)] rounded-full" />
                      </div>
                      <p className="text-[var(--shift-gray)] text-xs">67% Complete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[var(--shift-cream)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase mb-4 sm:mb-6">
            Ready to
            <br />
            <span className="text-gradient">Shift Your Ride?</span>
          </h2>
          <p className="text-[var(--shift-gray-light)] text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">
            Start your Trip Ticket today and experience the future of car
            importing. Quick. Smart. Vivide.
          </p>
          <Button variant="primary" size="lg" className="animate-pulse-glow w-full sm:w-auto">
            Get Your Trip Ticket
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="py-12 sm:py-16 px-4 sm:px-6 border-t border-[var(--shift-black-muted)]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div className="sm:col-span-2">
              <Logo variant="full" color="yellow" className="h-8 sm:h-10 w-auto mb-4 sm:mb-6" />
              <p className="text-[var(--shift-gray-light)] mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                Premium car import service bringing the finest vehicles from UAE
                and Qatar to Egypt.
              </p>
              <p className="text-[var(--shift-gray)] text-xs sm:text-sm">
                23B Ivoire East, 5th Settlement
                <br />
                New Cairo, Egypt
              </p>
            </div>

            <div>
              <h4 className="text-[var(--shift-cream)] font-bold uppercase mb-3 sm:mb-4 text-sm sm:text-base">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {["Services", "Trip Ticket", "About", "Contact"].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(" ", "-")}`}
                      className="text-[var(--shift-gray-light)] hover:text-[var(--shift-yellow)] transition-colors text-xs sm:text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[var(--shift-cream)] font-bold uppercase mb-3 sm:mb-4 text-sm sm:text-base">
                Contact
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="text-[var(--shift-gray-light)]">
                  <span className="text-[var(--shift-yellow)]">Phone:</span>{" "}
                  (+20) 0937 220 111
                </li>
                <li className="text-[var(--shift-gray-light)]">
                  <span className="text-[var(--shift-yellow)]">Web:</span>{" "}
                  Shift.com
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[var(--shift-black-muted)] flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-[var(--shift-gray)] text-xs sm:text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} SHIFT By Joe. All rights
              reserved.
            </p>
            <p className="text-[var(--shift-gray)] text-xs sm:text-sm">
              Quick &bull; Smart &bull; Vivide
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
