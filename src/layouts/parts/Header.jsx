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
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
              src="/images/desirefit.png"
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
