import { Helmet } from "@dr.pogodin/react-helmet";
import { motion } from "motion/react";
import ScrollReveal from "@/components/ScrollReveal";
import { Shield, Award, CheckCircle, Zap } from "lucide-react";
import { about } from "virtual:content";
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
const certIcons = [Shield, Award, CheckCircle, Zap, Shield, Award];
function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about#webpage`,
    name: about.meta.title,
    url: `${siteUrl}/about`,
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
        <title>About DESIREFIT — Commercial EV Charging Specialists</title>
        <meta name="description" content="DESIREFIT is a specialist EV charging infrastructure company delivering precision-engineered solutions for commercial fleets, property developers, and businesses." />
        <link rel="canonical" href={`${siteUrl}/about`} />
        <meta property="og:title" content={about.meta.title} />
        <meta property="og:description" content={about.meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/about`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <main>
        <section
          className="pl-28 mt-40 pr-28 pb-12 bg-background"
          aria-label="About hero image"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: "easeOut",
            }}
            className="relative w-full h-[420px] rounded-2xl overflow-hidden"
          >
            <img
              src="/images/aboutushero.png"
              alt="DESIREFIT EV charging station at a modern commercial building"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </motion.div>
        </section>
        <section
          className="bg-card border-y border-border/30"
          aria-label="Company statistics"
        >
          <div className="w-full py-10 pl-28 pr-28">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {about.stats.map((stat, i) => (
                /* @__PURE__ */ <motion.div
                  initial={{
                    opacity: 0,
                    y: 16,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  className="text-center lg:text-left"
                >
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-foreground/50 text-sm font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-10 bg-background" aria-label="Our mission">
          <div className="w-full pl-28 pr-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                }}
                variants={stagger}
                className="lg:sticky lg:top-28"
              >
                <motion.span
                  variants={fadeUp}
                  className="block text-primary text-xs font-semibold tracking-widest uppercase mb-4"
                >
                  Our Mission
                </motion.span>
                <motion.h2
                  variants={fadeUp}
                  className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6"
                >
                  Power the Future. Built to Last.
                </motion.h2>
                <div className="w-10 h-1 bg-primary" />
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                }}
                variants={stagger}
                className="flex flex-col gap-5"
              >
                <motion.div
                  variants={fadeUp}
                  className="w-full h-56 rounded-2xl overflow-hidden mb-2"
                >
                  <img
                    src="/images/aboutusmission.png"
                    alt="DESIREFIT team collaborating on EV charging solutions"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
                <motion.p
                  variants={fadeUp}
                  className="text-foreground/60 text-base leading-relaxed"
                >
                  {about.mission.body1}
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  className="text-foreground/60 text-base leading-relaxed"
                >
                  {about.mission.body2}
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  className="text-foreground/60 text-base leading-relaxed"
                >
                  {about.mission.body3}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-background" aria-label="Our story">
          <div className="w-full pl-28 pr-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                }}
                variants={stagger}
                className="lg:col-span-4 lg:sticky lg:top-28"
              >
                <motion.span
                  variants={fadeUp}
                  className="block text-primary text-xs font-semibold tracking-widest uppercase mb-4"
                >
                  Our Story
                </motion.span>
                <motion.h2
                  variants={fadeUp}
                  className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6"
                >
                  It started with a problem no one was solving.
                </motion.h2>
                <motion.div
                  variants={fadeUp}
                  className="border-l-4 border-primary pl-5 mt-8"
                >
                  <p className="text-primary font-semibold text-lg leading-snug italic">
                    "Why is charging a commercial fleet harder than it should be?"
                  </p>
                </motion.div>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                }}
                variants={stagger}
                className="lg:col-span-8 flex flex-col gap-6 pt-2"
              >
                <motion.div
                  variants={fadeUp}
                  className="w-full h-64 rounded-2xl overflow-hidden"
                >
                  <img
                    src="/images/aboutusstory.png"
                    alt="DESIREFIT fleet depot EV charging facility"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
                <motion.p
                  variants={fadeUp}
                  className="text-foreground/65 text-base leading-relaxed"
                >
                  {about.story.body1}
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  className="text-foreground/65 text-base leading-relaxed"
                >
                  {about.story.body2}
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  className="text-foreground/65 text-base leading-relaxed"
                >
                  {about.story.body3}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>
        <section
          className="py-10 bg-card border-y border-border/20"
          aria-label="Our values"
        >
          <div className="w-full pl-28 pr-28">
            <div className="mb-14">
              <span className="block text-primary text-xs font-semibold tracking-widest uppercase mb-3">
                What We Stand For
              </span>
              <ScrollReveal>
                <h2 className="text-4xl font-bold text-foreground">
                  Our Core Values
                </h2>
              </ScrollReveal>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {about.values.map((val, i) => (
                /* @__PURE__ */ <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  className="bg-background border border-border/30 rounded-xl p-8 hover:border-primary/30 transition-colors"
                >
                  <div className="flex gap-5">
                    <span className="text-4xl font-black text-primary/20 leading-none select-none shrink-0">
                      {val.number}
                    </span>
                    <div>
                      <h3 className="text-foreground font-bold text-lg mb-2">
                        {val.title}
                      </h3>
                      <p className="text-foreground/50 text-sm leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section
          className="py-10 bg-background"
          aria-label="Certifications and standards"
        >
          <div className="w-full pl-28 pr-28">
            <div className="mb-14">
              <span className="block text-primary text-xs font-semibold tracking-widest uppercase mb-3">
                Standards & Compliance
              </span>
              <ScrollReveal delay={0.1}>
                <h2 className="text-4xl font-bold text-foreground">
                  Certifications
                </h2>
              </ScrollReveal>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {about.certifications.map((cert, i) => {
                const Icon = certIcons[i % certIcons.length];
                return (
                  /* @__PURE__ */ <motion.div
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.06,
                      ease: "easeOut",
                    }}
                    className="flex items-start gap-4 bg-card border border-border/30 rounded-xl p-6"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-bold text-sm mb-1">
                        {cert.title}
                      </h3>
                      <p className="text-foreground/50 text-xs leading-relaxed">
                        {cert.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
        <section
          className="py-10 bg-card border-t border-border/20"
          aria-label="Contact CTA"
        >
          <div className="w-full pl-28 pr-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="w-10 h-1 bg-primary mb-6" />
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Ready to Work With Us?
                </h2>
                <p className="text-foreground/50 text-base leading-relaxed">
                  Contact our team to discuss your EV charging requirements. We'll provide a free site assessment and infrastructure proposal.
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:items-end">
                <a
                  href={`mailto:${about.cta.email}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-base rounded hover:bg-primary/90 transition-colors"
                  style={{
                    boxShadow: "0 0 28px hsl(var(--primary) / 0.3)",
                  }}
                >
                  <Zap size={16} />
                  Contact DESIREFIT
                </a>
                <a
                  href={`mailto:${about.cta.email}`}
                  className="text-foreground/40 text-sm hover:text-primary transition-colors"
                >
                  {about.cta.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
export { AboutPage as default };
