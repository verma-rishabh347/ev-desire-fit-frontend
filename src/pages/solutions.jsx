import { Helmet } from "@dr.pogodin/react-helmet";
import { motion } from "motion/react";
import ScrollReveal from "@/components/ScrollReveal";
import { CheckCircle, Zap, Mail, Phone, ArrowRight } from "lucide-react";
import { solutions } from "virtual:content";
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
function SolutionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/solutions#webpage`,
    name: solutions.meta.title,
    url: `${siteUrl}/solutions`,
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
        <title>{solutions.meta.title}</title>
        <meta name="description" content={solutions.meta.description} />
        <link rel="canonical" href={`${siteUrl}/solutions`} />
        <meta property="og:title" content={solutions.meta.title} />
        <meta property="og:description" content={solutions.meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/solutions`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <main>
        <section
          className="relative pt-[140px] pb-10 bg-background"
          aria-label="Solutions hero"
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
                {solutions.hero.eyebrow}
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-5"
              >
                {solutions.hero.headline}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-foreground/60 text-lg leading-relaxed"
              >
                {solutions.hero.subheading}
              </motion.p>
            </motion.div>
          </div>
        </section>
        <section className="py-10 bg-background" aria-label="Our solutions">
          <div className="w-full pl-28 pr-28">
            <div className="flex flex-col gap-6">
              {solutions.solutions.map((sol, i) => (
                /* @__PURE__ */ <motion.div
                  initial={{
                    opacity: 0,
                    y: 24,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-card border border-border/30 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <div className="lg:col-span-2 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border/20 flex flex-col justify-between">
                    <div>
                      <span className="block text-5xl font-black text-primary/15 leading-none mb-4 select-none">
                        {sol.number}
                      </span>
                      <span className="block text-primary text-xs font-semibold tracking-widest uppercase mb-3">
                        {sol.tagline}
                      </span>
                      <h2 className="text-2xl font-bold text-foreground">
                        {sol.title}
                      </h2>
                    </div>
                  </div>
                  <div className="lg:col-span-3 p-8 lg:p-10">
                    <p className="text-foreground/60 text-base leading-relaxed mb-7">
                      {sol.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {sol.deliverables.map((d) => (
                        /* @__PURE__ */ <div className="flex items-start gap-3">
                          <CheckCircle
                            size={15}
                            className="text-primary mt-0.5 shrink-0"
                          />
                          <span className="text-foreground/70 text-sm leading-relaxed">
                            {d.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section
          className="py-10 bg-card border-y border-border/20"
          aria-label="Our process"
        >
          <div className="w-full pl-28 pr-28">
            <div className="mb-14">
              <span className="block text-primary text-xs font-semibold tracking-widest uppercase mb-3">
                {solutions.process.eyebrow}
              </span>
              <ScrollReveal>
                <h2 className="text-4xl font-bold text-foreground">
                  {solutions.process.headline}
                </h2>
              </ScrollReveal>
            </div>
            <div className="relative">
              <div className="hidden lg:block absolute top-8 left-8 right-8 h-px bg-border/30" />
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {solutions.process.steps.map((step, i) => (
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
                      duration: 0.4,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                    className="relative flex flex-col"
                  >
                    <div
                      className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-5 relative z-10"
                      style={{
                        boxShadow: "0 0 16px hsl(var(--primary) / 0.2)",
                      }}
                    >
                      <span className="text-primary font-black text-sm">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-foreground font-bold text-base mb-2">
                      {step.title}
                    </h3>
                    <p className="text-foreground/50 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    {i < solutions.process.steps.length - 1 && (
                      /* @__PURE__ */ <ArrowRight
                        size={14}
                        className="text-primary/30 mt-4 hidden lg:block"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="py-10 bg-background" aria-label="Get started CTA">
          <div className="w-full pl-28 pr-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-10 h-1 bg-primary mb-6" />
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5">
                  {solutions.cta.headline}
                </h2>
                <p className="text-foreground/50 text-base leading-relaxed">
                  {solutions.cta.subheading}
                </p>
              </div>
              <div className="flex flex-col gap-5 lg:items-end">
                <a
                  href={`mailto:${solutions.cta.email}?subject=Free Site Assessment Request&body=Hi DESIREFIT team,%0A%0AI'd like to request a free site assessment for an EV charging installation.%0A%0APlease get in touch to discuss my requirements.%0A%0AThank you.`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-base rounded hover:bg-primary/90 transition-colors"
                  style={{
                    boxShadow: "0 0 28px hsl(var(--primary) / 0.3)",
                  }}
                >
                  <Zap size={16} />
                  {solutions.cta.ctaLabel}
                </a>
                <div className="flex flex-col gap-2 lg:items-end">
                  <a
                    href={`mailto:${solutions.cta.email}`}
                    className="inline-flex items-center gap-2 text-foreground/40 text-sm hover:text-primary transition-colors"
                  >
                    <Mail size={13} />
                    {solutions.cta.email}
                  </a>
                  <a
                    href="tel:+919999992951"
                    className="inline-flex items-center gap-2 text-foreground/40 text-sm hover:text-primary transition-colors"
                  >
                    <Phone size={13} />
                    {solutions.cta.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
export { SolutionsPage as default };
