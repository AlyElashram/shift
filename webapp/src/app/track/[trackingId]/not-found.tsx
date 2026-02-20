import Link from "next/link";
import { Logo } from "@/components/ui";

export default function TrackingNotFound() {
  return (
    <div className="min-h-screen bg-[var(--shift-black)] grain-overlay flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--shift-gray)]/20">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/">
            <Logo variant="full" color="yellow" className="h-8 w-auto" />
          </Link>
          <span className="text-[var(--shift-gray)] text-sm">
            Shipment Tracking
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--shift-yellow)]/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--shift-yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[var(--shift-cream)] uppercase mb-2">
            Shipment Not Found
          </h1>
          <p className="text-[var(--shift-gray-light)] mb-6 max-w-md mx-auto">
            We couldn't find a shipment with this tracking ID. Please check the link and try again.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
