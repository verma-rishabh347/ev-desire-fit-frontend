import { Link } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";
const solutions = [
  {
    label: "Commercial AC Charging",
    href: "/solutions",
  },
  {
    label: "DC Fast Charging",
    href: "/solutions",
  },
  {
    label: "Fleet Depot Solutions",
    href: "/solutions",
  },
  {
    label: "Smart Management",
    href: "/solutions",
  },
];
const industries = [
  {
    label: "Fleet Operators",
    href: "/industries",
  },
  {
    label: "Commercial Real Estate",
    href: "/industries",
  },
  {
    label: "Parking Facilities",
    href: "/industries",
  },
  {
    label: "Retail & Hospitality",
    href: "/industries",
  },
];
const company = [
  {
    label: "About DESIREFIT",
    href: "/about",
  },
  {
    label: "Solutions",
    href: "/solutions",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
];
function Footer() {
  return (
    /* @__PURE__ */ <footer
      style={{
        background: "hsl(var(--footer-bg))",
        color: "hsl(var(--footer-text))",
      }}
    >
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg, transparent 0%, hsl(var(--footer-primary)) 30%, hsl(var(--footer-accent)) 60%, transparent 100%)`,
          boxShadow: "none",
        }}
      />
      <div className="w-full py-16 pl-28 pr-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1 flex flex-col">
            <Link to="/" className="inline-block mb-6 self-start">
              <img
                src="/images/evdesirefit-logo-transparent.png"
                alt="DESIREFIT"
                className="block h-24 w-80 object-contain"
                style={{
                  boxShadow: "none",
                }}
              />
            </Link>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{
                color: "hsl(var(--footer-text-muted))",
              }}
            >
              Powering the future of commercial EV infrastructure.
              Precision-engineered charging solutions for fleets and businesses
              across India.
            </p>
            <div className="flex flex-col gap-3 mt-auto">
              <a
                href="mailto:info@evdesirefit.com"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{
                  color: "hsl(var(--footer-text-muted))",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "hsl(var(--footer-primary))")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    "hsl(var(--footer-text-muted))")
                }
              >
                <Mail
                  size={14}
                  style={{
                    color: "hsl(var(--footer-primary))",
                    flexShrink: 0,
                  }}
                />
                info@evdesirefit.com
              </a>
              <a
                href="tel:+919999992951"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{
                  color: "hsl(var(--footer-text-muted))",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "hsl(var(--footer-primary))")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    "hsl(var(--footer-text-muted))")
                }
              >
                <Phone
                  size={14}
                  style={{
                    color: "hsl(var(--footer-primary))",
                    flexShrink: 0,
                  }}
                />
                +91 9999992951
              </a>
              <span
                className="flex items-center gap-2 text-sm"
                style={{
                  color: "hsl(var(--footer-text-muted))",
                }}
              >
                <MapPin
                  size={14}
                  style={{
                    color: "hsl(var(--footer-primary))",
                    flexShrink: 0,
                  }}
                />
                Available Nationwide
              </span>
            </div>
          </div>
          <div>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{
                color: "hsl(var(--footer-text))",
              }}
            >
              Solutions
            </h3>
            <div
              className="mb-5"
              style={{
                width: 28,
                height: 2,
                background: "hsl(var(--footer-primary))",
                borderRadius: 2,
              }}
            />
            <ul className="flex flex-col gap-3">
              {solutions.map((item) => (
                /* @__PURE__ */ <li>
                  <Link
                    to={item.href}
                    className="text-sm transition-colors"
                    style={{
                      color: "hsl(var(--footer-text-muted))",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "hsl(var(--footer-primary))")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        "hsl(var(--footer-text-muted))")
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{
                color: "hsl(var(--footer-text))",
              }}
            >
              Industries
            </h3>
            <div
              className="mb-5"
              style={{
                width: 28,
                height: 2,
                background: "hsl(var(--footer-primary))",
                borderRadius: 2,
              }}
            />
            <ul className="flex flex-col gap-3">
              {industries.map((item) => (
                /* @__PURE__ */ <li>
                  <Link
                    to={item.href}
                    className="text-sm transition-colors"
                    style={{
                      color: "hsl(var(--footer-text-muted))",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "hsl(var(--footer-primary))")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        "hsl(var(--footer-text-muted))")
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{
                color: "hsl(var(--footer-text))",
              }}
            >
              Company
            </h3>
            <div
              className="mb-5"
              style={{
                width: 28,
                height: 2,
                background: "hsl(var(--footer-primary))",
                borderRadius: 2,
              }}
            />
            <ul className="flex flex-col gap-3">
              {company.map((item) => (
                /* @__PURE__ */ <li>
                  <Link
                    to={item.href}
                    className="text-sm transition-colors"
                    style={{
                      color: "hsl(var(--footer-text-muted))",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "hsl(var(--footer-primary))")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        "hsl(var(--footer-text-muted))")
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid hsl(var(--footer-border))",
        }}
      >
        <div className="w-full py-4 pl-28 pr-28 flex flex-wrap items-center justify-between gap-4">
          <p
            className="text-xs"
            style={{
              color: "hsl(var(--footer-text-dim))",
            }}
          >
            © {/* @__PURE__ */ new Date().getFullYear()} DESIREFIT. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacypolicy"
              className="text-xs transition-colors"
              style={{
                color: "hsl(var(--footer-text-dim))",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "hsl(var(--footer-primary))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "hsl(var(--footer-text-dim))")
              }
            >
              Privacy Policy
            </Link>
            <Link
              to="/termsconditions"
              className="text-xs transition-colors"
              style={{
                color: "hsl(var(--footer-text-dim))",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "hsl(var(--footer-primary))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "hsl(var(--footer-text-dim))")
              }
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export { Footer as default };
