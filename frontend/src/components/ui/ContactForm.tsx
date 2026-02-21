import { useState, FormEvent } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "./Button";
import { createLead } from "../../api/leads";
import { getErrorMessage } from "../../api/client";
import styles from "../../styles/components/ContactForm.module.css";

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
  const [submitError, setSubmitError] = useState("");

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
    setSubmitError("");

    try {
      await createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        document_status: formData.documentStatus,
      });
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.successIcon}>
          <svg
            className={styles.successSvg}
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
        <h3 className={styles.successTitle}>Thank You!</h3>
        <p className={styles.successMessage}>
          We&apos;ll be in touch with you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.fieldGroup}>
        <label htmlFor="name" className={styles.label}>
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          placeholder="Enter your full name"
        />
        {errors.name && <p className={styles.error}>{errors.name}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="phone" className={styles.label}>
          Phone Number
        </label>
        <PhoneInput
          international
          defaultCountry="EG"
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value || "" })}
          className={`phone-input-container ${errors.phone ? "phone-input-error" : ""}`}
        />
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          placeholder="Enter your email address"
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={`${styles.label} ${styles.labelRadioGroup}`}>
          Do you have any of the following?
        </label>
        <div className={styles.radioGroup}>
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
              className={`${styles.radioOption} ${
                formData.documentStatus === option.value
                  ? styles.radioOptionSelected
                  : ""
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
                className={styles.radioInput}
              />
              <div>
                <p className={styles.radioLabel}>{option.label}</p>
                <p className={styles.radioDescription}>{option.description}</p>
              </div>
            </label>
          ))}
        </div>
        {errors.documentStatus && (
          <p className={styles.error}>{errors.documentStatus}</p>
        )}
      </div>

      {submitError && (
        <div className={styles.submitError}>{submitError}</div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className={styles.submitButton}
        isLoading={isSubmitting}
      >
        Submit Inquiry
      </Button>
    </form>
  );
}
