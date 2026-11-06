import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
const navLinks = [
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Solutions",
    href: "/solutions",
  },
  {
    label: "Industries",
    href: "/industries",
  },
];
const productMenu = [
  {
    title: "AC Chargers",
    description: "Wall-mounted charging for home, office and commercial use.",
    image: "/images/7.5ac.png",
    items: [
      ["3.3 kW", "/products?variant=wall-charger-3-3kw"],
      ["7.4 kW", "/products?variant=wall-charger-7-4kw"],
      ["22 kW", "/products?variant=wall-charger-22kw"],
    ],
  },
  {
    title: "DC Chargers",
    description: "High-power fast charging for fleets and public locations.",
    image: "/images/60dc.png",
    items: [
      ["30 kW", "/products?variant=dc-fast-charger-30kw"],
      ["60 kW", "/products?variant=dc-fast-charger-60kw"],
      ["120 kW", "/products?variant=dc-fast-charger-120kw"],
    ],
  },
  {
    title: "Portable Charger",
    description: "Flexible charging wherever your EV takes you.",
    image: "/images/portable.png",
    items: [["2.3 kW", "/products?variant=portable-charger"]],
  },
];
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  return (
    /* @__PURE__ */ <header
      style={{
        background: "hsl(var(--navbar-bg))",
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-md border-b border-border/30 shadow-lg shadow-black/10" : ""}`}
    >
      <div className="w-full pl-28 pr-28">
        <div className="flex items-center h-16 md:h-20">
          <Link to="/" className="flex items-center shrink-0 min-w-0">
            <img
              src="/images/evdesirefit-logo-transparent.png"
              alt="DESIREFIT"
              className="block h-auto max-h-10 md:max-h-12 w-auto max-w-[220px] object-contain"
            />
          </Link>
          <div className="flex-1 flex items-center justify-end gap-8">
            <nav
              aria-label="Main navigation"
              className="hidden md:flex items-center gap-8"
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                if (link.label === "Products") {
                  return (
                    <div className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
                      <Link to={link.href} className={`relative text-[15px] font-medium tracking-wide transition-colors duration-200 group ${isActive ? "text-primary" : "text-black hover:text-primary"}`}>
                        Products
                        <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${isActive || productsOpen ? "w-full" : "w-0 group-hover:w-full"}`} />
                      </Link>
                      {productsOpen && (
                        <div className="absolute left-1/2 top-full z-50 mt-0 w-[760px] -translate-x-1/2 rounded-2xl border border-border/60 bg-white p-5 shadow-2xl">
                          <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-4">
                            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">EV charging solutions</p><h3 className="mt-1 text-xl font-bold text-foreground">Choose your charger</h3></div>
                            <Link to="/products" onClick={() => setProductsOpen(false)} className="text-sm font-semibold text-primary hover:underline">View all products →</Link>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            {productMenu.map((group) => (
                              <div key={group.title} className="rounded-xl border border-border/60 p-3 transition-colors hover:border-primary/50">
                                <Link to={group.items[0][1]} onClick={() => setProductsOpen(false)} className="mb-3 flex h-24 items-center justify-center rounded-lg bg-muted/60"><img src={group.image} alt={group.title} className="h-full w-full object-contain" /></Link>
                                <Link to={group.items[0][1]} onClick={() => setProductsOpen(false)} className="font-bold text-foreground hover:text-primary">{group.title}</Link>
                                <p className="mt-1 min-h-10 text-xs leading-5 text-muted-foreground">{group.description}</p>
                                <div className="mt-3 space-y-1 border-t border-border/50 pt-2">
                                  {group.items.map(([power, href]) => <Link key={power} to={href} onClick={() => setProductsOpen(false)} className="flex items-center justify-between rounded px-2 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10 hover:text-primary"><span>{power}</span><span>→</span></Link>)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  /* @__PURE__ */ <Link
                    to={link.href}
                    className={`relative text-[15px] font-medium tracking-wide transition-colors duration-200 group ${isActive ? "text-primary" : "text-black hover:text-primary"}`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                    />
                  </Link>
                );
              })}
              <Link
                to="/about"
                className={`relative text-[15px] font-medium tracking-wide transition-colors duration-200 group ${location.pathname === "/about" ? "text-primary" : "text-black hover:text-primary"}`}
              >
                About Us
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${location.pathname === "/about" ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
              <Link
                to="/resources"
                className={`relative text-[15px] font-medium tracking-wide transition-colors duration-200 group ${location.pathname === "/resources" ? "text-primary" : "text-black hover:text-primary"}`}
              >
                Resources
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${location.pathname === "/resources" ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
              <Link
                to="/contact"
                className={`relative text-[15px] font-medium tracking-wide transition-colors duration-200 group ${location.pathname === "/contact" ? "text-primary" : "text-black hover:text-primary"}`}
              >
                Contact Us
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${location.pathname === "/contact" ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <button
                className="md:hidden text-black hover:text-primary transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  /* @__PURE__ */ <X size={22} />
                ) : (
                  /* @__PURE__ */ <Menu size={22} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          /* @__PURE__ */ <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            style={{
              background: "hsl(var(--navbar-bg))",
            }}
            className="md:hidden border-t border-border/30 overflow-hidden"
          >
            <nav
              aria-label="Mobile navigation"
              className="px-6 py-4 flex flex-col gap-4"
            >
              {navLinks.map((link) => (
                /* @__PURE__ */ <Link
                  to={link.href}
                  className="text-black hover:text-primary text-sm font-medium tracking-wide transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/about"
                className="text-black hover:text-primary text-sm font-medium tracking-wide transition-colors py-1"
              >
                About Us
              </Link>
              <Link
                to="/resources"
                className="text-black hover:text-primary text-sm font-medium tracking-wide transition-colors py-1"
              >
                Resources
              </Link>
              <Link
                to="/contact"
                className="text-black hover:text-primary text-sm font-medium tracking-wide transition-colors py-1"
              >
                Contact Us
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded transition-colors mt-2"
              >
                <Zap size={14} />
                Request a Quote
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
export { Header as default };
