import { Logo, Button, MobileNav, ContactForm } from "@/components/ui";

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
              Our Process
            </a>
            <a
              href="#showcase"
              className="text-[var(--shift-cream)] hover:text-[var(--shift-yellow)] transition-colors text-sm uppercase tracking-wider"
            >
              Showcase
            </a>
            <a href="#contact">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </a>
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

          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-[var(--shift-cream)] text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-none mb-6 sm:mb-8">
              Premium Car
              <br />
              <span className="text-gradient">Import Service</span>
            </h1>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-[var(--shift-gray-light)] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
              Bringing your dream cars from the{" "}
              <span className="text-[var(--shift-yellow)]">UAE</span> to Egypt
              with our seamless Trip Ticket system.
            </p>
          </div>

          <div
            className="animate-slide-up flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            style={{ animationDelay: "0.4s" }}
          >
            <a href="#contact">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Start Your Trip Ticket
              </Button>
            </a>
            <a href="#trip-ticket">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </a>
          </div>
        </div>

        {/* Scroll indicator - hidden on very small screens */}
        <a
          href="#services"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block hover:text-[var(--shift-yellow)] transition-colors"
          aria-label="Scroll to services"
        >
          <svg
            className="w-6 h-6 text-[var(--shift-gray)] hover:text-[var(--shift-yellow)] transition-colors"
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
        </a>
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
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
            ].map((service, index) => (
              <div
                key={index}
                className="bg-[var(--shift-black-muted)] border border-[var(--shift-gray)] rounded-[var(--radius-md)] p-[var(--space-lg)]"
              >
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-[var(--shift-yellow)]/10 flex items-center justify-center mb-4 sm:mb-6">
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

      {/* Showcase Section */}
      <section id="showcase" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[var(--shift-yellow)] uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4">
              Our Track Record
            </p>
            <h2 className="text-[var(--shift-cream)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase">
              Successfully Imported
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                image: "/images/cars/car-1.jpg",
                model: "Mercedes-Benz G63 AMG",
                year: "2023",
                origin: "Dubai, UAE",
              },
              {
                image: "/images/cars/car-2.jpg",
                model: "Porsche 911 Turbo S",
                year: "2024",
                origin: "Abu Dhabi, UAE",
              },
              {
                image: "/images/cars/car-3.jpg",
                model: "Range Rover Autobiography",
                year: "2023",
                origin: "Sharjah, UAE",
              },
              {
                image: "/images/cars/car-4.jpg",
                model: "BMW X7 M60i",
                year: "2024",
                origin: "Dubai, UAE",
              },
              {
                image: "/images/cars/car-5.jpg",
                model: "Audi RS Q8",
                year: "2023",
                origin: "Dubai, UAE",
              },
              {
                image: "/images/cars/car-6.jpg",
                model: "Lexus LX 600",
                year: "2024",
                origin: "Abu Dhabi, UAE",
              },
            ].map((car, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border border-[var(--shift-gray)] hover:border-[var(--shift-yellow)] transition-all"
              >
                {/* Image Container */}
                <div className="aspect-[4/3] bg-[var(--shift-black-muted)] relative overflow-hidden">
                  {/* Placeholder - replace with actual images */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 text-[var(--shift-gray)] mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-[var(--shift-gray)] text-xs">
                        {car.model}
                      </p>
                    </div>
                  </div>
                  {/* Uncomment when images are added:
                  <Image
                    src={car.image}
                    alt={car.model}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  */}
                </div>

                {/* Car Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--shift-black)] via-[var(--shift-black)]/80 to-transparent p-4 sm:p-6">
                  <p className="text-[var(--shift-yellow)] text-xs uppercase tracking-wider mb-1">
                    {car.year} &bull; {car.origin}
                  </p>
                  <h3 className="text-[var(--shift-cream)] text-base sm:text-lg font-bold uppercase">
                    {car.model}
                  </h3>
                </div>

                {/* Success Badge */}
                <div className="absolute top-3 right-3 bg-[var(--shift-yellow)] text-[var(--shift-black)] text-xs font-bold uppercase px-2 py-1 rounded">
                  Delivered
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <p className="text-[var(--shift-gray-light)] text-sm sm:text-base mb-4">
              Join our growing list of satisfied customers
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-[var(--shift-yellow)] hover:text-[var(--shift-yellow-light)] transition-colors font-medium uppercase text-sm tracking-wider"
            >
              Start Your Import
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--shift-black-muted)]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-start">
            <div>
              <p className="text-[var(--shift-yellow)] uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4">
                Get In Touch
              </p>
              <h2 className="text-[var(--shift-cream)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase mb-4 sm:mb-6">
                Start Your
                <br />
                <span className="text-gradient">Journey Today</span>
              </h2>
              <p className="text-[var(--shift-gray-light)] text-base sm:text-lg mb-6 sm:mb-8">
                Ready to import your dream car? Fill out the form and our team
                will get back to you.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--shift-yellow)]/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[var(--shift-yellow)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[var(--shift-gray)] text-xs uppercase tracking-wider">
                      Phone
                    </p>
                    <p className="text-[var(--shift-cream)] text-sm sm:text-base">
                      (+20) 109 258 0008
                    </p>
                    <p className="text-[var(--shift-cream)] text-sm sm:text-base">
                      (+20) 107 004 0076
                    </p>
                    <p className="text-[var(--shift-cream)] text-sm sm:text-base">
                      (+971) 527 756 568
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--shift-yellow)]/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[var(--shift-yellow)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[var(--shift-gray)] text-xs uppercase tracking-wider">
                      Location
                    </p>
                    <a
                      href="https://maps.app.goo.gl/XHUgEiupFn3ykyFS6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--shift-cream)] text-sm sm:text-base hover:text-[var(--shift-yellow)] transition-colors"
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
      <footer
        className="py-12 sm:py-16 px-4 sm:px-6 border-t border-[var(--shift-black-muted)]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div className="sm:col-span-2">
              <Logo variant="full" color="yellow" className="h-8 sm:h-10 w-auto mb-4 sm:mb-6" />
              <p className="text-[var(--shift-gray-light)] mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                Premium car import service bringing the finest vehicles from the
                UAE to Egypt.
              </p>
              <a
                href="https://maps.app.goo.gl/XHUgEiupFn3ykyFS6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--shift-gray)] text-xs sm:text-sm hover:text-[var(--shift-yellow)] transition-colors block"
              >
                Building 81, South Lotus
                <br />
                New Cairo, Egypt
              </a>
            </div>

            <div>
              <h4 className="text-[var(--shift-cream)] font-bold uppercase mb-3 sm:mb-4 text-sm sm:text-base">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {["Services", "Trip Ticket", "Showcase", "Contact"].map((link) => (
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
              <ul className="space-y-1 text-xs sm:text-sm">
                <li className="text-[var(--shift-gray-light)]">
                  <span className="text-[var(--shift-yellow)]">Phone:</span>{" "}
                  (+20) 109 258 0008
                </li>
                <li className="text-[var(--shift-gray-light)]">
                  (+20) 107 004 0076
                </li>
                <li className="text-[var(--shift-gray-light)]">
                  (+971) 527 756 568
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[var(--shift-black-muted)] flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-[var(--shift-gray)] text-xs sm:text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} SHIFT By Joe. All rights
              reserved.
            </p>
            
          </div>
        </div>
      </footer>
    </div>
  );
}
