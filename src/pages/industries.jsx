import { useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { motion } from "motion/react";
import { CheckCircle, Zap, ArrowRight } from "lucide-react";
import { industries } from "virtual:content";
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
function IndustriesPage() {
  const [activeId, setActiveId] = useState(industries.sectors[0].id);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/industries#webpage`,
    name: industries.meta.title,
    url: `${siteUrl}/industries`,
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
        <title>{industries.meta.title}</title>
        <meta name="description" content={industries.meta.description} />
        <link rel="canonical" href={`${siteUrl}/industries`} />
        <meta property="og:title" content={industries.meta.title} />
        <meta property="og:description" content={industries.meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/industries`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <main>
        <section
          className="relative pt-[140px] pb-10 bg-background"
          aria-label="Industries hero"
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
                {industries.hero.eyebrow}
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-5"
              >
                {industries.hero.headline}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-foreground/60 text-lg leading-relaxed"
              >
                {industries.hero.subheading}
              </motion.p>
            </motion.div>
          </div>
        </section>
        <section
          className="bg-card border-y border-border/30 sticky top-16 md:top-20 z-30"
          aria-label="Industry sectors"
        >
          <div className="w-full pl-28 pr-28">
            <div
              className="flex gap-0 overflow-x-auto"
              role="group"
              aria-label="Filter by industry"
            >
              {industries.sectors.map((sec) => (
                /* @__PURE__ */ <button
                  onClick={() => setActiveId(sec.id)}
                  className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${activeId === sec.id ? "border-primary text-primary" : "border-transparent text-foreground/50 hover:text-foreground"}`}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="py-10 bg-background" aria-label="Industry details">
          <div className="w-full pl-28 pr-28">
            {industries.sectors.map((sec) => (
              /* @__PURE__ */ <div
                className={activeId === sec.id ? "block" : "hidden"}
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 16,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <div className="mb-12">
                    <span className="block text-primary text-xs font-semibold tracking-widest uppercase mb-3">
                      {sec.eyebrow}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 max-w-2xl">
                      {sec.title}
                    </h2>
                    <p className="text-foreground/60 text-lg leading-relaxed max-w-3xl">
                      {sec.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-12 max-w-sm">
                    <div className="bg-card border border-border/30 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {sec.stat1Value}
                      </div>
                      <div className="text-foreground/50 text-xs font-medium">
                        {sec.stat1Label}
                      </div>
                    </div>
                    <div className="bg-card border border-border/30 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {sec.stat2Value}
                      </div>
                      <div className="text-foreground/50 text-xs font-medium">
                        {sec.stat2Label}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border border-border/30 rounded-xl p-8">
                      <h3 className="text-foreground font-bold text-lg mb-6">
                        Key Challenges
                      </h3>
                      <div className="flex flex-col gap-4">
                        {sec.challenges.map((ch) => (
                          /* @__PURE__ */ <div className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />
                            <span className="text-foreground/60 text-sm leading-relaxed">
                              {ch.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-card border border-primary/30 rounded-xl p-8">
                      <h3 className="text-foreground font-bold text-lg mb-6">
                        DESIREFIT Solutions
                      </h3>
                      <div className="flex flex-col gap-4">
                        {sec.solutions.map((sol) => (
                          /* @__PURE__ */ <div className="flex items-start gap-3">
                            <CheckCircle
                              size={15}
                              className="text-primary mt-0.5 shrink-0"
                            />
                            <span className="text-foreground/70 text-sm leading-relaxed">
                              {sol.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>
        <section
          className="py-10 bg-card border-t border-border/20"
          aria-label="All industry sectors"
        >
          <div className="w-full pl-28 pr-28">
            <div className="mb-10">
              <span className="block text-primary text-xs font-semibold tracking-widest uppercase mb-3">
                All Sectors
              </span>
              <h2 className="text-3xl font-bold text-foreground">
                Every Industry We Serve
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {industries.sectors.map((sec, i) => (
                /* @__PURE__ */ <motion.button
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
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  onClick={() => {
                    setActiveId(sec.id);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className={`text-left p-7 rounded-xl border transition-all duration-200 group ${activeId === sec.id ? "border-primary bg-background" : "border-border/30 bg-card hover:border-primary/40"}`}
                >
                  <div className="w-8 h-px bg-primary mb-5 group-hover:w-12 transition-all duration-300" />
                  <span className="block text-primary text-xs font-semibold tracking-widest uppercase mb-2">
                    {sec.eyebrow}
                  </span>
                  <h3 className="text-foreground font-bold text-lg mb-2">
                    {sec.title}
                  </h3>
                  <div className="flex items-center gap-1 text-primary text-xs font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    View solutions <ArrowRight size={12} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
        <section
          className="py-10 bg-background border-t border-border/20"
          aria-label="Contact CTA"
        >
          <div className="w-full pl-28 pr-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="w-10 h-1 bg-primary mb-6" />
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  {industries.cta.headline}
                </h2>
                <p className="text-foreground/50 text-base leading-relaxed">
                  {industries.cta.subheading}
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:items-end">
                <a
                  href={`mailto:${industries.cta.email}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-base rounded hover:bg-primary/90 transition-colors"
                  style={{
                    boxShadow: "0 0 28px hsl(var(--primary) / 0.3)",
                  }}
                >
                  <Zap size={16} />
                  {industries.cta.ctaLabel}
                </a>
                <a
                  href={`mailto:${industries.cta.email}`}
                  className="text-foreground/40 text-sm hover:text-primary transition-colors"
                >
                  {industries.cta.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
export { IndustriesPage as default };
