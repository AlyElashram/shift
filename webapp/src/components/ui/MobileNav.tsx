"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Logo } from "./Logo";
import { Button } from "./Button";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#trip-ticket", label: "Our Process" },
  { href: "#showcase", label: "Showcase" },
];

// Safe hydration check using useSyncExternalStore
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const menuContent = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#000000",
        zIndex: 9999,
        display: isOpen ? "block" : "none",
      }}
    >
      <div className="flex flex-col h-full p-6">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="self-end w-10 h-10 flex items-center justify-center text-[var(--shift-cream)] hover:text-[var(--shift-yellow)]"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="mt-4 mb-8">
          <Logo variant="full" color="yellow" className="h-8 w-auto" />
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-[var(--shift-cream)] hover:text-[var(--shift-yellow)] transition-colors text-lg uppercase tracking-wider py-2 border-b border-[var(--shift-black-muted)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="mt-8">
          <a href="#contact" onClick={() => setIsOpen(false)}>
            <Button variant="primary" size="md" className="w-full">
              Get Started
            </Button>
          </a>
        </div>

        {/* Contact Info */}
        <div className="mt-auto pt-8 border-t border-[var(--shift-black-muted)]">
          <p className="text-[var(--shift-gray)] text-sm mb-1">
            <span className="text-[var(--shift-yellow)]">Phone:</span> (+20) 109 258 0008
          </p>
          <p className="text-[var(--shift-gray)] text-sm mb-1">
            (+20) 107 004 0076
          </p>
          <p className="text-[var(--shift-gray)] text-sm">
            (+971) 527 756 568
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 bg-[var(--shift-black-muted)] border border-[var(--shift-gray)] rounded-md"
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-0.5 bg-[var(--shift-cream)] transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-[var(--shift-cream)] transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-[var(--shift-cream)] transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Portal to body */}
      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}

export default MobileNav;
