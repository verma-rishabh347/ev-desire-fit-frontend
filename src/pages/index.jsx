import { Link, useNavigate } from "react-router";
import { Helmet } from "@dr.pogodin/react-helmet";
import { motion } from "motion/react";
import { ArrowRight, Zap, ChevronRight } from "lucide-react";
import { home } from "virtual:content";
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};
const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};
const productImageSlots = [
  "/images/mainac1.png",
  "/images/maindc1.png",
  "/images/portablehero.png",
  "/images/portablehero.png",
];
const siteUrl = "https://desirefit.com";
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "DESIREFIT",
      url: `${siteUrl}/`,
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "DESIREFIT",
      url: `${siteUrl}/`,
      description:
        "Commercial EV charger and charging solutions specialist for fleet operators and businesses.",
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: `${siteUrl}/`,
      name: "DESIREFIT \u2014 Commercial EV Charging Solutions",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#organization`,
      },
      datePublished: "2026-08-22",
      dateModified: "2026-08-22",
    },
  ],
};
function HomePage() {
  const navigate = useNavigate();
  return (
    /* @__PURE__ */ <>
      <Helmet>
        <title>DESIREFIT — Commercial EV Charging Solutions</title>
        <meta
          name="description"
          content="DESIREFIT delivers precision-engineered EV charging infrastructure for commercial fleets, parking facilities, and property developers. AC, DC fast charging, and smart management."
        />
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta
          property="og:title"
          content="DESIREFIT — Commercial EV Charging Solutions"
        />
        <meta
          property="og:description"
          content="Precision-engineered EV charging solutions for commercial operators and fleet managers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:image" content={`${siteUrl}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="DESIREFIT — Commercial EV Charging Solutions"
        />
        <meta
          name="twitter:description"
          content="Precision-engineered EV charging solutions for commercial operators and fleet managers."
        />
        <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <main>
        <section
          className="relative min-h-screen flex items-center overflow-hidden bg-background"
          aria-label="Hero"
        >
          <div className="absolute inset-0 bg-background">
            <img
              src="/images/mainhero.png"
              alt=""
              className="w-full h-full object-contain"
              fetchPriority="high"
              loading="eager"
              width={1920}
              height={1080}
            />
          </div>
          <div
            className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
            style={{
              boxShadow: "0 0 24px 4px hsl(var(--primary) / 0.5)",
            }}
          />
          <div className="relative z-10 w-full pt-[140px] pb-10 pl-28 pr-28">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-2xl"
            >
              <motion.div variants={fadeUp} className="mb-5">
                <span className="inline-flex items-center gap-2 text-primary text-xs font-semibold tracking-widest uppercase">
                  <Zap size={12} />
                  EV Charging Solutions
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-6"
              >
                Power the Future of{" "}
                <span className="text-primary">Electric Mobility</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-white/80 text-lg leading-relaxed mb-10 max-w-xl"
              >
                DESIREFIT delivers intelligent EV charging infrastructure for commercial, fleet, and residential applications — built for reliability, scalability, and smart energy management.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded text-sm transition-all duration-200 hover:bg-primary/90"
                  style={{
                    boxShadow: "0 0 20px hsl(var(--primary) / 0.35)",
                    animation: "pulse-glow 2.5s ease-in-out infinite",
                  }}
                >
                  View Products
                  <ArrowRight size={15} />
                </Link>
                <Link
                  to="/solutions"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/60 text-white hover:text-primary hover:border-primary font-semibold rounded text-sm transition-all duration-200"
                >
                  Explore Solutions
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-primary" />
          </div>
        </section>
        <section
          className="relative bg-card border-y border-border/30 overflow-hidden"
          aria-label="Key statistics"
        >
          <div className="w-full py-12 pl-28 pr-28">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 sm:gap-16">
              {home.stats.map((stat, i) => (
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
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  className="inline-flex flex-col ml-56 items-start shrink-0"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1 leading-none whitespace-nowrap">
                    {stat.value}
                  </div>
                  <div className="text-foreground/50 text-sm font-medium tracking-wide mt-1 whitespace-nowrap">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section
          className="py-10 bg-background"
          aria-label="Products and solutions"
        >
          <div className="w-full pl-28 pr-28">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
              variants={stagger}
              className="mb-14"
            >
              <motion.span
                variants={fadeUp}
                className="block text-primary text-xs font-semibold tracking-widest uppercase mb-3"
              >
                Products & Solutions
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-4xl md:text-5xl font-bold text-foreground mb-4 max-w-xl"
              >
                Charging Solutions for Every Need
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-foreground/50 text-base leading-relaxed max-w-2xl"
              >
                From residential Level 2 chargers to high-power DC fast chargers and intelligent fleet management platforms — DESIREFIT has you covered.
              </motion.p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              <motion.div
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
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.015,
                }}
                onClick={() => navigate("/products?variant=wall-charger-3-3kw")}
                className="relative rounded-xl overflow-hidden bg-card border border-border/30 group cursor-pointer min-h-[455px]"
              >
                <img
                  src={productImageSlots[0]}
                  alt={home.products.items[0].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={800}
                  height={340}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.38) 58%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <span className="inline-block text-white/80 text-xs font-semibold tracking-widest uppercase mb-2">
                    {home.products.items[0].category}
                  </span>
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {home.products.items[0].title}
                  </h3>
                  <p className="text-white/85 text-sm leading-relaxed mb-4 max-w-md">
                    {home.products.items[0].description}
                  </p>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-white/70 text-xs uppercase tracking-wider mb-0.5">
                        {home.products.items[0].spec1Label}
                      </div>
                      <div className="text-white font-semibold text-sm">
                        {home.products.items[0].spec1Value}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs uppercase tracking-wider mb-0.5">
                        {home.products.items[0].spec2Label}
                      </div>
                      <div className="text-white font-semibold text-sm">
                        {home.products.items[0].spec2Value}
                      </div>
                    </div>
                  </div>
                  <Link to="/products" onClick={(event) => event.stopPropagation()} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all">Explore charger <ArrowRight size={16} /></Link>
                </div>
              </motion.div>
              <motion.div
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
                  delay: 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.015,
                }}
                onClick={() => navigate("/products?variant=dc-fast-charger-30kw")}
                className="relative rounded-xl overflow-hidden bg-card border border-border/30 group cursor-pointer min-h-[455px]"
              >
                <img
                  src={productImageSlots[1]}
                  alt={home.products.items[1].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={400}
                  height={340}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.38) 58%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block text-white/80 text-xs font-semibold tracking-widest uppercase mb-2">
                    {home.products.items[1].category}
                  </span>
                  <h3 className="text-white text-xl font-bold mb-2">
                    {home.products.items[1].title}
                  </h3>
                  <p className="text-white/85 text-xs leading-relaxed mb-3">
                    {home.products.items[1].description}
                  </p>
                  <div className="flex gap-5">
                    <div>
                      <div className="text-white/70 text-xs uppercase tracking-wider mb-0.5">
                        {home.products.items[1].spec1Label}
                      </div>
                      <div className="text-white font-semibold text-xs">
                        {home.products.items[1].spec1Value}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs uppercase tracking-wider mb-0.5">
                        {home.products.items[1].spec2Label}
                      </div>
                      <div className="text-white font-semibold text-xs">
                        {home.products.items[1].spec2Value}
                      </div>
                    </div>
                  </div>
                  <Link to="/products" onClick={(event) => event.stopPropagation()} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all">Explore charger <ArrowRight size={16} /></Link>
                </div>
              </motion.div>
              <motion.div
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
                  delay: 0.15,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.015,
                }}
                onClick={() => navigate("/products?variant=portable-charger")}
                className="relative rounded-xl overflow-hidden bg-card border border-border/30 group cursor-pointer min-h-[455px]"
              >
                <img
                  src={productImageSlots[2]}
                  alt={home.products.items[2].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={400}
                  height={300}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.38) 58%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block text-white/80 text-xs font-semibold tracking-widest uppercase mb-2">
                    {home.products.items[2].category}
                  </span>
                  <h3 className="text-white text-xl font-bold mb-2">
                    {home.products.items[2].title}
                  </h3>
                  <p className="text-white/85 text-xs leading-relaxed mb-3">
                    {home.products.items[2].description}
                  </p>
                  <div className="flex gap-5">
                    <div>
                      <div className="text-black/50 text-xs uppercase tracking-wider mb-0.5">
                        {home.products.items[2].spec1Label}
                      </div>
                      <div className="text-black font-semibold text-xs">
                        {home.products.items[2].spec1Value}
                      </div>
                    </div>
                    <div>
                      <div className="text-black/50 text-xs uppercase tracking-wider mb-0.5">
                        {home.products.items[2].spec2Label}
                      </div>
                      <div className="text-black font-semibold text-xs">
                        {home.products.items[2].spec2Value}
                      </div>
                    </div>
                  </div>
                  <Link to="/products?variant=portable-charger" onClick={(event) => event.stopPropagation()} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all">Explore charger <ArrowRight size={16} /></Link>
                </div>
              </motion.div>
              <motion.div
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
                  delay: 0.2,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.015,
                }}
                className="hidden"
              >
                <img
                  src={productImageSlots[3]}
                  alt={home.products.items[3].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={800}
                  height={300}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, hsl(var(--bento-cream) / 0.92) 0%, hsl(var(--bento-cream) / 0.60) 45%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <span className="inline-block text-black/70 text-xs font-semibold tracking-widest uppercase mb-2">
                    {home.products.items[3].category}
                  </span>
                  <h3 className="text-black text-2xl font-bold mb-2">
                    {home.products.items[3].title}
                  </h3>
                  <p className="text-black/75 text-sm leading-relaxed mb-4 max-w-md">
                    {home.products.items[3].description}
                  </p>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-black/50 text-xs uppercase tracking-wider mb-0.5">
                        {home.products.items[3].spec1Label}
                      </div>
                      <div className="text-black font-semibold text-sm">
                        {home.products.items[3].spec1Value}
                      </div>
                    </div>
                    <div>
                      <div className="text-black/50 text-xs uppercase tracking-wider mb-0.5">
                        {home.products.items[3].spec2Label}
                      </div>
                      <div className="text-black font-semibold text-sm">
                        {home.products.items[3].spec2Value}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <section
          className="py-10 bg-card border-y border-border/20"
          aria-label="Why DESIREFIT"
        >
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
                  Why DESIREFIT
                </motion.span>
                <motion.h2
                  variants={fadeUp}
                  className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6"
                >
                  Built for Performance, Designed for Scale
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="text-foreground/50 text-base leading-relaxed mb-8"
                >
                  We combine hardware excellence with intelligent software to deliver EV charging solutions that grow with your business.
                </motion.p>
                <motion.div variants={fadeUp}>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all duration-200"
                  >
                    Learn about our approach <ChevronRight size={15} />
                  </Link>
                </motion.div>
              </motion.div>
              <div className="flex flex-col gap-0">
                {home.why.differentiators.map((item, i) => (
                  /* @__PURE__ */ <motion.div
                    initial={{
                      opacity: 0,
                      x: 24,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                    className="flex gap-6 py-8 border-b border-border/20 last:border-0"
                  >
                    <div className="shrink-0">
                      <span className="text-4xl font-black text-primary/20 leading-none select-none">
                        {item.number}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-foreground text-lg font-bold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-foreground/50 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section
          className="py-10 bg-background"
          aria-label="Industries we serve"
        >
          <div className="w-full pl-28 pr-28">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
              variants={stagger}
              className="mb-14"
            >
              <motion.span
                variants={fadeUp}
                className="block text-primary text-xs font-semibold tracking-widest uppercase mb-3"
              >
                  Industries We Serve
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-4xl md:text-5xl font-bold text-foreground max-w-xl"
              >
                  Tailored for Every Sector
              </motion.h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {home.industries.items.map((item, i) => (
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
                  className="bg-card border border-border/30 rounded-xl p-7 hover:border-primary/40 transition-colors duration-300 group"
                >
                  <div className="w-8 h-px bg-primary mb-5 group-hover:w-12 transition-all duration-300" />
                  <h3 className="text-foreground font-bold text-lg mb-3">
                    {item.title}
                  </h3>
                  <p className="text-foreground/50 text-sm leading-relaxed mb-5">
                    {item.description}
                  </p>
                  <span className="text-primary text-xs font-semibold tracking-wide">
                    {item.stat}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section
          className="py-10 bg-card border-t border-border/20 overflow-hidden"
          aria-label="Call to action"
        >
          <div className="w-full pl-28 pr-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                }}
                variants={stagger}
              >
                <motion.div variants={fadeUp} className="mb-2">
                  <div className="w-12 h-1 bg-primary mb-6" />
                  <span className="text-primary text-xs font-semibold tracking-widest uppercase">
                    Get Started
                  </span>
                </motion.div>
                <motion.h2
                  variants={fadeUp}
                  className="text-4xl md:text-5xl font-bold text-foreground leading-tight mt-3 mb-6"
                >
                  Ready to Electrify Your Space?
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="text-foreground/50 text-base leading-relaxed"
                >
                  Talk to our experts and get a customised EV charging solution for your site.
                </motion.p>
              </motion.div>
              <motion.div
                initial={{
                  opacity: 0,
                  x: 32,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                }}
                className="flex flex-col gap-5 lg:items-end"
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold text-base rounded transition-all duration-200 hover:bg-primary/90"
                  style={{
                    boxShadow: "0 0 32px hsl(var(--primary) / 0.3)",
                  }}
                >
                  <Zap size={18} />
                  <span>Contact Us Today</span>
                  <ArrowRight size={16} />
                </Link>
                <p className="text-foreground/30 text-xs">
                  No obligation. Free site assessment included.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px hsl(var(--primary) / 0.35); }
          50% { box-shadow: 0 0 36px hsl(var(--primary) / 0.6); }
        }
      `}</style>
    </>
  );
}
export { HomePage as default };
