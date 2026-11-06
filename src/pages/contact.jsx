import { useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { motion } from "motion/react";
import ScrollReveal from "@/components/ScrollReveal";
import { Zap, Mail, Phone, Clock, CheckCircle, Send } from "lucide-react";
import { contact } from "virtual:content";
const siteUrl = "https://desirefit.com";
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};
const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    sector: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    if (!formState.name.trim()) newErrors.name = "Name is required.";
    if (!formState.company.trim()) newErrors.company = "Company is required.";
    if (!formState.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formState.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formState.sector) newErrors.sector = "Please select your industry.";
    if (!formState.message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };
  const handleChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const next = {
          ...prev,
        };
        delete next[e.target.name];
        return next;
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const payload = {
        access_key: "57e22f3f-70d1-42f5-8a65-b5e0daadcbdb",
        name: formState.name,
        email: formState.email,
        company: formState.company,
        phone: formState.phone,
        sector: formState.sector,
        message: formState.message,
        subject: "New Inquiry from DESIREFIT Website",
        from_name: "DESIREFIT Contact Form",
      };
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      alert("Network error. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/contact#webpage`,
    name: contact.meta.title,
    url: `${siteUrl}/contact`,
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    about: {
      "@id": `${siteUrl}/#organization`,
    },
  };
  return (
    /* @__PURE__ */ <>
      <Helmet>
        <title>Contact DESIREFIT — Get in Touch</title>
        <meta name="description" content="Contact DESIREFIT for commercial EV charging inquiries, site assessments, and fleet charging solutions. Email us at info@evdesirefit.com." />
        <link rel="canonical" href={`${siteUrl}/contact`} />
        <meta property="og:title" content={contact.meta.title} />
        <meta property="og:description" content={contact.meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/contact`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <main>
        <section
          className="relative pt-[140px] pb-10 bg-background"
          aria-label="Contact hero"
        >
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary"
            style={{
              left: "112px",
              boxShadow: "0 0 24px 4px hsl(var(--primary) / 0.4)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--primary) / 0.10) 0%, transparent 70%)",
              left: "112px",
              right: 0,
            }}
          />
          <div className="w-full pl-[132px] pr-28">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-2xl"
            >
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 text-primary text-xs font-semibold tracking-widest uppercase mb-4"
              >
                <Zap size={12} />
                Get in Touch
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-5"
              >
                Let's Build Your Charging Infrastructure
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-foreground/60 text-lg leading-relaxed"
              >
                Tell us about your project. Our team will respond within one business day with a tailored assessment and proposal.
              </motion.p>
            </motion.div>
          </div>
        </section>
        <section
          className="py-10 bg-background"
          aria-label="Contact form and details"
        >
          <div className="w-full pl-28 pr-28">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="w-full lg:flex-1">
                <div className="bg-card border border-border/30 rounded-2xl p-8 md:p-10">
                  {submitted ? (
                    /* @__PURE__ */ <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <CheckCircle size={32} className="text-primary" />
                      </div>
                      <h3 className="text-foreground text-2xl font-bold mb-3">
                        Inquiry Received
                      </h3>
                      <p className="text-foreground/50 text-sm leading-relaxed max-w-sm">
                        Thank you for reaching out. Our commercial team will
                        review your requirements and respond within one business
                        day.
                      </p>
                      <p className="text-primary text-sm font-semibold mt-4">
                        {contact.contactDetails.email}
                      </p>
                    </motion.div>
                  ) : (
                    /* @__PURE__ */ <form onSubmit={handleSubmit} noValidate>
                      <input
                        type="hidden"
                        name="access_key"
                        value="57e22f3f-70d1-42f5-8a65-b5e0daadcbdb"
                      />
                      <h2 className="text-foreground font-bold text-xl mb-8">
                        Send an Inquiry
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-2"
                          >
                            {contact.formLabels.nameLabel}
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder={contact.formLabels.namePlaceholder}
                            value={formState.name}
                            onChange={handleChange}
                            className={`w-full bg-background border rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors ${errors.name ? "border-red-500" : "border-border/40"}`}
                          />
                          {errors.name && (
                            /* @__PURE__ */ <p className="text-red-500 text-xs mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="company"
                            className="block text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-2"
                          >
                            {contact.formLabels.companyLabel}
                          </label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            required
                            placeholder={contact.formLabels.companyPlaceholder}
                            value={formState.company}
                            onChange={handleChange}
                            className={`w-full bg-background border rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors ${errors.company ? "border-red-500" : "border-border/40"}`}
                          />
                          {errors.company && (
                            /* @__PURE__ */ <p className="text-red-500 text-xs mt-1">
                              {errors.company}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-2"
                          >
                            {contact.formLabels.emailLabel}
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder={contact.formLabels.emailPlaceholder}
                            value={formState.email}
                            onChange={handleChange}
                            className={`w-full bg-background border rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors ${errors.email ? "border-red-500" : "border-border/40"}`}
                          />
                          {errors.email && (
                            /* @__PURE__ */ <p className="text-red-500 text-xs mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-2"
                          >
                            {contact.formLabels.phoneLabel}
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder={contact.formLabels.phonePlaceholder}
                            value={formState.phone}
                            onChange={handleChange}
                            className={`w-full bg-background border rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors ${errors.phone ? "border-red-500" : "border-border/40"}`}
                          />
                          {errors.phone && (
                            /* @__PURE__ */ <p className="text-red-500 text-xs mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mb-5">
                        <label
                          htmlFor="sector"
                          className="block text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-2"
                        >
                          {contact.formLabels.sectorLabel}
                        </label>
                        <select
                          id="sector"
                          name="sector"
                          value={formState.sector}
                          onChange={handleChange}
                          className={`w-full bg-background border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors ${errors.sector ? "border-red-500" : "border-border/40"}`}
                        >
                          <option value="">Select your industry</option>
                          {contact.sectors.map((s) => (
                            /* @__PURE__ */ <option value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        {errors.sector && (
                          /* @__PURE__ */ <p className="text-red-500 text-xs mt-1">
                            {errors.sector}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="message"
                          className="block text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-2"
                        >
                          {contact.formLabels.messageLabel}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          placeholder={contact.formLabels.messagePlaceholder}
                          value={formState.message}
                          onChange={handleChange}
                          className={`w-full bg-background border rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors resize-none ${errors.message ? "border-red-500" : "border-border/40"}`}
                        />
                        {errors.message && (
                          /* @__PURE__ */ <p className="text-red-500 text-xs mt-1">
                            {errors.message}
                          </p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-base rounded hover:bg-primary/90 transition-colors disabled:opacity-60"
                        style={{
                          boxShadow: "0 0 24px hsl(var(--primary) / 0.3)",
                        }}
                      >
                        {submitting ? (
                          /* @__PURE__ */ <>Sending...</>
                        ) : (
                          /* @__PURE__ */ <>
                            <Send size={16} />
                            {contact.formLabels.submitLabel}
                          </>
                        )}
                      </button>
                      <p className="text-foreground/30 text-xs text-center mt-4">
                        Or email us directly at{" "}
                        <a
                          href={`mailto:${contact.contactDetails.email}`}
                          className="text-primary hover:underline"
                        >
                          {contact.contactDetails.email}
                        </a>
                      </p>
                    </form>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-[480px] shrink-0 flex flex-col gap-8">
                <div
                  className="flex-1 rounded-2xl overflow-hidden border border-border/30"
                  style={{
                    minHeight: "420px",
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d72781.0391258019!2d75.68611072642518!3d29.12338585776809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1793721105372!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      minHeight: "520px",
                      display: "block",
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="DESIREFIT Location Map"
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <h2 className="text-foreground font-bold text-xl">
                    Contact Details
                  </h2>
                  <a
                    href={`mailto:${contact.contactDetails.email}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Mail size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-foreground/40 text-xs uppercase tracking-wider mb-0.5">
                        Email
                      </div>
                      <div className="text-foreground font-semibold text-sm group-hover:text-primary transition-colors">
                        {contact.contactDetails.email}
                      </div>
                    </div>
                  </a>
                  <a
                    href={`tel:${contact.contactDetails.phone.replace(/\s/g, "")}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Phone size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-foreground/40 text-xs uppercase tracking-wider mb-0.5">
                        Phone
                      </div>
                      <div className="text-foreground font-semibold text-sm group-hover:text-primary transition-colors">
                        {contact.contactDetails.phone}
                      </div>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-foreground/40 text-xs uppercase tracking-wider mb-0.5">
                        Hours
                      </div>
                      <div className="text-foreground font-semibold text-sm">
                        {contact.contactDetails.availability}
                      </div>
                      <div className="text-foreground/40 text-xs mt-1">
                        {contact.contactDetails.supportNote}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 pl-28 pr-28 bg-white">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-80 shrink-0 lg:sticky lg:top-24">
              <ScrollReveal>
                <p
                  className="text-sm font-semibold tracking-widest uppercase mb-4"
                  style={{
                    color: "hsl(var(--primary))",
                  }}
                >
                  FAQs
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
                  Got questions about EVs?
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-8">
                  Contact us if you still have any questions to make your
                  experience smoother.
                </p>
                <a
                  href="mailto:info@evdesirefit.com"
                  className="inline-block px-6 py-3 rounded-lg font-semibold text-white text-sm transition-opacity hover:opacity-90"
                  style={{
                    background: "hsl(var(--primary))",
                  }}
                >
                  Got More Questions?
                </a>
              </ScrollReveal>
            </div>
            <div className="flex-1 divide-y divide-border/30">
              {contact.faqs.map((faq, i) => (
                /* @__PURE__ */ <details className="group py-5 cursor-pointer">
                  <summary className="flex items-center justify-between gap-4 text-base font-semibold text-black group-open:text-primary transition-colors duration-200 list-none">
                    {faq.q}
                    <span className="shrink-0 w-6 h-6 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground group-open:text-primary group-open:border-primary transition-colors duration-200">
                      <svg
                        className="w-3 h-3 transition-transform duration-200 group-open:rotate-45"
                        fill="none"
                        viewBox="0 0 12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 1v10M1 6h10" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground pr-10">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
export { ContactPage as default };
