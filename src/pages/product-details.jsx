import { Helmet } from "@dr.pogodin/react-helmet";
import { Link, useParams } from "react-router";
import { CheckCircle2, ArrowLeft, Zap } from "lucide-react";
import { products } from "virtual:content";
const siteUrl = "https://evdesirefit.com";
const productImages = {
  "wall-charger-3-3kw": "/images/3.3achero.png",
  "wall-charger-7-4kw": "/images/7.5achero.png",
  "wall-charger-22kw": "/images/22achero.png",
  "dc-fast-charger-30kw": "/images/hero30dc.png",
  "dc-fast-charger-60kw": "/images/hero60dc.png",
  "dc-fast-charger-120kw": "/images/hero120dc.png", 
  "portable-charger": "/images/portablehero.png",
};
const exploreImages = {
  "wall-charger-3-3kw": "/images/3.3ac.png",
  "wall-charger-7-4kw": "/images/7.5ac.png",
  "wall-charger-22kw": "/images/22ac.png",
  "dc-fast-charger-30kw": "/images/30dc.png",
  "dc-fast-charger-60kw": "/images/60dc.png",
  "dc-fast-charger-120kw": "/images/120dc.png",
};
function ProductDetailsPage() {
  const { slug } = useParams();
  const portableProduct = {
    id: "portable-charger",
    chargerType: "portable",
    slug: "portable-charger",
    label: products.portable.title,
    title: products.portable.title,
    tagline: products.portable.tagline,
    description: products.portable.description,
    specs: products.portable.specs,
    features: products.portable.highlights.map((highlight) => ({
      id: highlight.id,
      text: `${highlight.label} \u2014 ${highlight.detail}`,
    })),
  };
  const selected =
    products.categories.find((category) => category.slug === slug) ??
    (slug === "portable-charger" ? portableProduct : products.categories[0]);
  const acProducts = products.categories.filter(
    (category) => category.chargerType === "ac",
  );
  const dcProducts = products.categories.filter(
    (category) => category.chargerType === "dc",
  );
  const applications =
    "applications" in selected && Array.isArray(selected.applications)
      ? selected.applications
      : [];
  return (
    /* @__PURE__ */ <>
      <Helmet>
        <title>{selected.title} Specifications — DESIREFIT</title>
        <meta
          name="description"
          content={`Full specifications and technical details for the DESIREFIT ${selected.title}.`}
        />
        <link rel="canonical" href={`${siteUrl}/products/${selected.slug}`} />
      </Helmet>
      <main className="bg-background pt-28 pb-20 sm:pt-36">
        <div className="mx-auto w-full max-w-[1440px] px-[15px]">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/55 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to products
          </Link>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(220px,0.38fr)] items-start">
            <section className="lg:col-span-2 rounded-3xl bg-card border border-border/40 p-6 sm:p-9 shadow-sm">
              <div className="aspect-[16/8] overflow-hidden rounded-2xl border border-border/40 bg-background">
                <img
                  src={
                    productImages[selected.slug] ??
                    productImages["dc-fast-charger-30kw"]
                  }
                  alt={selected.title}
                  className={`h-full w-full object-cover ${selected.chargerType === "ac" ? "object-top" : "object-center"}`}
                  loading="eager"
                />
              </div>
              <div className="mb-8" />
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-3">
                {selected.chargerType.toUpperCase()} EV CHARGER
              </p>
              <h1 className="mt-0 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                {selected.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-foreground/65">
                {selected.description}
              </p>
              <div className="mt-10 flex items-center gap-3 border-b border-border/40 pb-4">
                <Zap size={18} className="text-primary" />
                <h2 className="mt-0 text-xl font-bold">
                  Complete specifications
                </h2>
              </div>
              <div className="mt-5 grid gap-6 lg:grid-cols-4 items-start">
                <div className="grid gap-3 sm:grid-cols-2 lg:col-span-3">
                  {selected.specs.map((spec) => (
                    /* @__PURE__ */ <div className="rounded-2xl border border-border/40 bg-background p-4">
                      <p className="mb-1 text-xs uppercase tracking-wider text-foreground/45">
                        {spec.label}
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
                {selected.features?.length ? (
                  /* @__PURE__ */ <div className="lg:col-span-1 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 sm:p-6">
                    <h2 className="mt-0 mb-4 text-xl font-bold">
                      Key features
                    </h2>
                    <div className="grid gap-3">
                      {selected.features.map((feature) => (
                        /* @__PURE__ */ <div className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/75">
                          <CheckCircle2
                            size={17}
                            className="mt-0.5 shrink-0 text-primary"
                          />
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              {applications.length ? (
                /* @__PURE__ */ <div className="mt-8">
                  <h2 className="mt-0 mb-3 text-xl font-bold">Applications</h2>
                  <div className="flex flex-wrap gap-2">
                    {applications.map((application) => (
                      /* @__PURE__ */ <span className="rounded-full border border-border/50 bg-background px-3.5 py-2 text-sm font-semibold text-foreground/70">
                        {application}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
            <aside className="order-2 lg:col-span-2">
              <div className="border-t border-border/40 pt-8">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-foreground/45 mb-4">
                  EXPLORE PRODUCTS
                </p>
                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    {
                      label: "AC Chargers",
                      items: acProducts,
                    },
                    {
                      label: "DC Chargers",
                      items: dcProducts,
                    },
                    {
                      label: "Portable",
                      items: null,
                    },
                  ].map((group) => (
                    /* @__PURE__ */ <div
                      className={`rounded-2xl border p-4 ${group.label === "AC Chargers" ? "border-primary/15 bg-primary/[0.05]" : group.label === "DC Chargers" ? "border-accent/20 bg-accent/[0.06]" : "border-success/20 bg-success/[0.05]"}`}
                    >
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/45">
                        {group.label}
                      </p>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {group.items === null ? (
                          /* @__PURE__ */ <Link
                            to="/products/portable-charger"
                            className={`group w-[84px] min-w-[84px] ${selected.slug === "portable-charger" ? "text-primary" : "text-foreground"}`}
                          >
                            <div
                              className={`aspect-square overflow-hidden rounded-2xl border-2 bg-card transition-all group-hover:-translate-y-1 ${selected.slug === "portable-charger" ? "border-primary shadow-md shadow-primary/15" : "border-border/40 group-hover:border-primary/50"}`}
                            >
                              <img
                                src="/images/portable.png"
                                alt="Portable EV Charger"
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <p className="mt-2 text-center text-[10px] font-bold">
                              PORTABLE
                            </p>
                          </Link>
                        ) : (
                          group.items.map((category) => (
                            /* @__PURE__ */ <Link
                              to={`/products/${category.slug}`}
                              className={`group w-[84px] min-w-[84px] ${category.id === selected.id ? "text-primary" : "text-foreground"}`}
                            >
                              <div
                                className={`aspect-square overflow-hidden rounded-2xl border-2 bg-card transition-all group-hover:-translate-y-1 ${category.id === selected.id ? "border-primary shadow-md shadow-primary/15" : "border-border/40 group-hover:border-primary/50"}`}
                              >
                                <img
                                  src={
                                    exploreImages[category.slug] ??
                                    productImages[category.slug] ??
                                    productImages["dc-fast-charger-30kw"]
                                  }
                                  alt={category.label}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              <p className="mt-2 text-center text-[10px] font-bold">
                                {category.label
                                  .replace("Wall Charger ", "")
                                  .replace("DC Fast Charger ", "DC ")}
                              </p>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
export { ProductDetailsPage as default };
