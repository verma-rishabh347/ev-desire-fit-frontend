import { Helmet } from "@dr.pogodin/react-helmet";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  ArrowRight,
  Zap,
  BarChart2,
  Wrench,
} from "lucide-react";
const resources = [
  {
    id: "r-1",
    category: "Guide",
    icon: BookOpen,
    title: "EV Charging 101: A Complete Buyer's Guide",
    description:
      "Everything you need to know before choosing an EV charging solution \u2014 from Level 2 AC to DC fast charging, connectors, and installation requirements.",
    tag: "Beginner",
    tagColor: "bg-primary/10 text-primary",
  },
  {
    id: "r-2",
    category: "Whitepaper",
    icon: FileText,
    title: "Fleet Electrification: Planning Your Depot Charging Infrastructure",
    description:
      "A technical whitepaper covering load management, grid capacity planning, and phased rollout strategies for commercial fleet operators.",
    tag: "Technical",
    tagColor: "bg-accent/10 text-accent",
  },
  {
    id: "r-3",
    category: "Case Study",
    icon: BarChart2,
    title: "How a 200-Vehicle Fleet Cut Energy Costs by 30%",
    description:
      "Real-world results from a logistics company that deployed DESIREFIT smart charging with dynamic load balancing across three depot sites.",
    tag: "Case Study",
    tagColor: "bg-green-500/10 text-green-600",
  },
  {
    id: "r-4",
    category: "Video",
    icon: Video,
    title: "Installation Walkthrough: Wall EV Charger Setup",
    description:
      "Step-by-step video guide covering site assessment, mounting, wiring, and commissioning of the DESIREFIT Wall EV Charger.",
    tag: "Video",
    tagColor: "bg-purple-500/10 text-purple-600",
  },
  {
    id: "r-5",
    category: "Datasheet",
    icon: Download,
    title: "Wall EV Charger \u2014 Product Datasheet",
    description:
      "Full technical specifications, certifications, dimensions, and compatibility details for the DESIREFIT Wall EV Charger (3 kW & 11 kW variants).",
    tag: "Download",
    tagColor: "bg-secondary/10 text-secondary",
  },
  {
    id: "r-6",
    category: "Guide",
    icon: Wrench,
    title: "OCPP 2.0 Integration Guide for Network Operators",
    description:
      "Technical documentation for integrating DESIREFIT chargers with third-party CPMS platforms using the OCPP 2.0 open protocol.",
    tag: "Technical",
    tagColor: "bg-accent/10 text-accent",
  },
];
const faqs = [
  {
    id: "faq-1",
    q: "What is the difference between Level 2 and Level 3 charging?",
    a: "Level 2 uses AC power (up to 22 kW) and is ideal for overnight or workplace charging. Level 3 (DC fast charging) delivers up to 150 kW and can charge most EVs to 80% in under 30 minutes.",
  },
  {
    id: "faq-2",
    q: "Do your chargers work with all EV brands?",
    a: "Yes. DESIREFIT chargers use standard Type 2 and CCS connectors, compatible with all major EV brands including Tata, MG, Hyundai, Kia, BYD, and more.",
  },
  {
    id: "faq-3",
    q: "What is OCPP and why does it matter?",
    a: "OCPP (Open Charge Point Protocol) is an open standard that allows chargers to communicate with any backend management system. This prevents vendor lock-in and gives you full flexibility.",
  },
  {
    id: "faq-4",
    q: "Can I manage multiple charging sites from one platform?",
    a: "Absolutely. The DESIREFIT Smart Management Platform provides a centralised dashboard for real-time monitoring, billing, and remote diagnostics across unlimited sites.",
  },
];
function ResourcesPage() {
  const siteUrl = "https://evdesirefit.com";
  const pageUrl = `${siteUrl}/resources`;
  const title =
    "Resources \u2014 EV Charging Guides, Whitepapers & Case Studies | DESIREFIT";
  const description =
    "Explore DESIREFIT's library of EV charging guides, technical whitepapers, case studies, and product datasheets to help you make informed charging decisions.";
  return (
    /* @__PURE__ */ <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <main>
        <section
          className="relative overflow-hidden pt-[140px] pb-16"
          style={{
            background: "hsl(var(--background))",
          }}
        >
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary"
            style={{
              left: "112px",
              boxShadow: "0 0 24px 4px hsl(var(--primary) / 0.35)",
            }}
          />
          <div
            className="absolute inset-y-0 pointer-events-none"
            style={{
              left: "112px",
              right: 0,
              background:
                "linear-gradient(90deg, hsl(var(--primary) / 0.07) 0%, transparent 40%)",
            }}
          />
          <div className="relative pl-[132px] pr-28">
            <motion.p
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="text-primary text-sm font-semibold tracking-widest uppercase mb-3"
            >
              Knowledge Hub
            </motion.p>
            <motion.h1
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-4"
            >
              Resources & <span className="text-primary">Insights</span>
            </motion.h1>
            <motion.p
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="text-foreground/60 text-lg max-w-2xl leading-relaxed"
            >
              Guides, whitepapers, case studies, and technical documentation to
              help you plan, deploy, and optimise your EV charging
              infrastructure.
            </motion.p>
          </div>
        </section>
        <section className="py-16 pl-28 pr-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((item, i) => {
              const Icon = item.icon;
              return (
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
                    duration: 0.4,
                    delay: i * 0.07,
                  }}
                  className="group bg-card border border-border/40 rounded-2xl p-7 flex flex-col gap-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.tagColor}`}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-2">
                      {item.category}
                    </p>
                    <h3 className="text-foreground font-bold text-base leading-snug mb-3 group-hover:text-primary transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-foreground/55 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-auto pt-2">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-3 transition-all duration-200"
                    >
                      Request Access <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
        <section className="py-16 pl-28 pr-28 border-t border-border/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="lg:sticky lg:top-28 self-start">
              <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
                FAQ
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-foreground leading-tight mb-4">
                Common Questions
              </h2>
              <p className="text-foreground/55 text-base leading-relaxed mb-8">
                Can't find what you're looking for? Our team is happy to help.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Zap size={15} />
                Ask Our Experts
              </Link>
            </div>
            <div className="flex flex-col gap-6">
              {faqs.map((faq, i) => (
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
                  }}
                  className="border-b border-border/30 pb-6 last:border-0"
                >
                  <h3 className="text-foreground font-bold text-base mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-foreground/55 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 pl-28 pr-28">
          <div className="rounded-2xl bg-primary p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-widest mb-2">
                Need a Custom Solution?
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-primary-foreground leading-tight">
                Talk to Our Charging Experts
              </h2>
            </div>
            <Link
              to="/contact"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors text-sm"
            >
              <Zap size={16} />
              Get in Touch
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
export { ResourcesPage as default };
