"use client";

import { useState, FormEvent } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "./Button";

interface FormData {
  name: string;
  phone: string;
  email: string;
  documentStatus: "non-egyptian-passport" | "uae-eqama" | "none" | "";
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  documentStatus?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    documentStatus: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.documentStatus) {
      newErrors.documentStatus = "Please select your document status";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--shift-yellow)]/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--shift-yellow)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-[var(--shift-cream)] text-xl sm:text-2xl font-bold uppercase mb-2">
          Thank You!
        </h3>
        <p className="text-[var(--shift-gray-light)] text-sm sm:text-base">
          We&apos;ll be in touch with you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-[var(--shift-cream)] text-sm font-medium mb-2"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-3 bg-[var(--shift-black)] border ${
            errors.name
              ? "border-red-500"
              : "border-[var(--shift-gray)] focus:border-[var(--shift-yellow)]"
          } rounded-lg text-[var(--shift-cream)] placeholder-[var(--shift-gray)] outline-none transition-colors`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-red-500 text-xs sm:text-sm">{errors.name}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label
          htmlFor="phone"
          className="block text-[var(--shift-cream)] text-sm font-medium mb-2"
        >
          Phone Number
        </label>
        <PhoneInput
          international
          defaultCountry="EG"
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value || "" })}
          className={`phone-input-container ${errors.phone ? "phone-input-error" : ""}`}
        />
        {errors.phone && (
          <p className="mt-1 text-red-500 text-xs sm:text-sm">{errors.phone}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-[var(--shift-cream)] text-sm font-medium mb-2"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-3 bg-[var(--shift-black)] border ${
            errors.email
              ? "border-red-500"
              : "border-[var(--shift-gray)] focus:border-[var(--shift-yellow)]"
          } rounded-lg text-[var(--shift-cream)] placeholder-[var(--shift-gray)] outline-none transition-colors`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="mt-1 text-red-500 text-xs sm:text-sm">{errors.email}</p>
        )}
      </div>

      {/* Document Status */}
      <div>
        <label className="block text-[var(--shift-cream)] text-sm font-medium mb-3">
          Do you have any of the following?
        </label>
        <div className="space-y-3">
          {[
            {
              value: "non-egyptian-passport",
              label: "Non-Egyptian Passport",
              description: "I hold a passport from a country other than Egypt",
            },
            {
              value: "uae-eqama",
              label: "UAE Eqama (Residence Visa)",
              description: "I have a valid UAE residence permit",
            },
            {
              value: "none",
              label: "None of the above",
              description: "I only have an Egyptian passport",
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                formData.documentStatus === option.value
                  ? "border-[var(--shift-yellow)] bg-[var(--shift-yellow)]/5"
                  : "border-[var(--shift-gray)] hover:border-[var(--shift-gray-light)]"
              }`}
            >
              <input
                type="radio"
                name="documentStatus"
                value={option.value}
                checked={formData.documentStatus === option.value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documentStatus: e.target.value as FormData["documentStatus"],
                  })
                }
                className="mt-1 w-4 h-4 accent-[var(--shift-yellow)]"
              />
              <div>
                <p className="text-[var(--shift-cream)] font-medium text-sm sm:text-base">
                  {option.label}
                </p>
                <p className="text-[var(--shift-gray-light)] text-xs sm:text-sm">
                  {option.description}
                </p>
              </div>
            </label>
          ))}
        </div>
        {errors.documentStatus && (
          <p className="mt-2 text-red-500 text-xs sm:text-sm">
            {errors.documentStatus}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
      >
        Submit Inquiry
      </Button>
    </form>
  );
}
