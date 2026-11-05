import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { products } from 'virtual:content';

const siteUrl = 'https://evdesirefit.com';

// Thumbnail images per variant (reuse existing slots)
const variantImages = [
  '/airo-assets/images/pages/home/commercial-ac-charger',
  '/airo-assets/images/pages/home/dc-fast-charger',
  '/airo-assets/images/pages/home/fleet-depot',
  '/airo-assets/images/pages/home/smart-management',
  '/airo-assets/images/pages/home/hero',
];

const acGalleryImages = [
  '/images/mainac1.png',
  '/images/mainac2.png',
  '/images/mainac3.png',
  '/images/mainac4.png',
];

export default function ProductsPage() {
  const [chargerType, setChargerType] = useState<'ac' | 'dc' | 'portable'>('ac');
  const [activeVariantId, setActiveVariantId] = useState(products.categories[0].id);
  const [activeThumb, setActiveThumb] = useState(0);
  const [portableThumb, setPortableThumb] = useState(0);

  const activeVariant = products.categories.find((c) => c.id === activeVariantId) ?? products.categories[0];
  const visibleCategories = products.categories.filter((category) => category.chargerType === chargerType);

  function selectChargerType(type: 'ac' | 'dc') {
    setChargerType(type);
    const firstCategory = products.categories.find((category) => category.chargerType === type);
    if (firstCategory) setActiveVariantId(firstCategory.id);
    setActiveThumb(0);
  }

  // AC products share the supplied four-image gallery; DC keeps its existing gallery.
  const thumbSlots = chargerType === 'ac' ? acGalleryImages : variantImages.slice(0, 4);
  const portableImageSlots = [
    '/images/portablehero.png',
    '/images/portable.png',
    '/images/portable.png',
    '/images/portable.png',
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/products#webpage`,
    name: products.meta.title,
    url: `${siteUrl}/products`,
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
  };

  return (
    <>
      <Helmet>
        <title>{products.meta.title}</title>
        <meta name="description" content={products.meta.description} />
        <link rel="canonical" href={`${siteUrl}/products`} />
        <meta property="og:title" content={products.meta.title} />
        <meta property="og:description" content={products.meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/products`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
      </Helmet>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16 bg-background" aria-label="Products hero">
          <div className="absolute left-0 top-0 h-full w-1 bg-primary" style={{ boxShadow: '0 0 24px 4px hsl(var(--primary) / 0.4)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 10% 30%, hsl(var(--primary) / 0.13), transparent 38%), linear-gradient(120deg, transparent 45%, hsl(var(--accent) / 0.05))' }} />
          <div className="relative mx-auto w-full max-w-[1440px] px-[15px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 text-primary text-xs font-semibold tracking-widest uppercase mb-4">
                <Zap size={12} />
                {products.hero.eyebrow}
              </span>
              <h1 className="mt-0 text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.05] tracking-tight mb-5">
                {products.hero.headline}
              </h1>
              <p className="text-foreground/60 text-lg leading-relaxed">
                {products.hero.subheading}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Charger type selector */}
        <section className="bg-background pb-8" aria-label="Charger type">
          <div className="mx-auto w-full max-w-[1440px] px-[15px]">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-foreground/50 mb-3">CHOOSE YOUR POWER</p>
              <div className="inline-flex max-w-full flex-nowrap overflow-x-auto rounded-2xl bg-card border border-border/40 p-1.5 gap-1 shadow-sm">
                {(['ac', 'dc'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => selectChargerType(type)}
                    className={`whitespace-nowrap px-5 sm:px-7 py-3 rounded-xl text-sm font-bold uppercase transition-all ${
                      chargerType === type ? 'bg-primary text-white shadow-sm' : 'text-foreground/60 hover:text-foreground'
                    }`}
                  >
                    {type} Charger
                  </button>
                ))}
                <button
                  onClick={() => setChargerType('portable')}
                  className={`whitespace-nowrap px-5 sm:px-7 py-3 rounded-xl text-sm font-bold uppercase transition-all ${chargerType === 'portable' ? 'bg-primary text-white shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}
                >
                  Portable Charger
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PDP Section */}
        <section className="pb-20 bg-background" aria-label="Product details">
          <div className="mx-auto w-full max-w-[1440px] px-[15px]">
            {chargerType === 'portable' && (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
                <div className="flex flex-col gap-4 items-start">
                  <div className="px-1 sm:px-2">
                    <p className="text-xs font-bold tracking-widest uppercase mb-2 text-primary">PORTABLE EV CHARGER</p>
                    <h2 className="mt-0 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{products.portable.title}</h2>
                  </div>
                  <div className="flex gap-3 sm:gap-4 items-start w-full">
                  <div className="flex flex-col gap-3">
                    {portableImageSlots.map((slot, i) => (
                      <button key={`inline-portable-${i}`} onClick={() => setPortableThumb(i)} className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 ${portableThumb === i ? 'border-primary' : 'border-border/40'}`}>
                        <img src={slot} alt={`Portable charger view ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                  <div className="aspect-square min-w-0 flex-1 overflow-hidden rounded-3xl border border-border/40 bg-card shadow-sm">
                    <img src={portableImageSlots[portableThumb]} alt={products.portable.title} className="h-full w-full object-cover" />
                  </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0 p-1 sm:p-3 lg:pl-2 lg:pr-0 lg:pt-[76px]">
                  <p className="mt-0 text-base leading-relaxed text-foreground/65">{products.portable.description}</p>
                  <p className="mt-7 text-xs font-bold tracking-widest uppercase text-foreground/50 mb-3">POWER</p>
                  <div className="rounded-2xl border-2 border-primary bg-primary/5 p-4">
                    <span className="block text-lg font-bold text-primary">2.3 kW</span>
                    <span className="mt-1 block text-xs text-foreground/55">Single Phase</span>
                    <span className="mt-1 block text-sm font-semibold text-foreground/75">Portable EV Charger</span>
                  </div>
                  <p className="mt-7 text-xs font-bold tracking-widest uppercase text-foreground/50 mb-3">SPECIFICATIONS</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {products.portable.specs.slice(0, 4).map((spec) => (
                      <div key={spec.id} className="rounded-2xl border border-border/40 bg-background p-4">
                        <p className="text-xs uppercase tracking-wider text-foreground/45">{spec.label}</p>
                        <p className="mt-1 text-sm font-bold text-foreground">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                  <Link to="/products/portable-charger" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all">
                    View full specifications <ChevronRight size={16} />
                  </Link>
                  <Link to="/contact" className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-white hover:opacity-90">
                    <Zap size={16} /> Request a Quote <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            )}
            <motion.div
              key={activeVariantId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`flex flex-col lg:flex-row gap-8 xl:gap-14 items-start ${chargerType === 'portable' ? 'hidden' : ''}`}
            >
              {/* ── LEFT: Thumbnail strip + Main image ── */}
              <div className="flex flex-col gap-4 w-full lg:w-[56%] shrink-0 self-start">
                <div className="px-1 sm:px-2">
                  <p className="text-xs font-bold tracking-widest uppercase mb-2 text-primary">
                    {chargerType.toUpperCase()} EV CHARGER
                  </p>
                  <h2 className="mt-0 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                    {activeVariant.title}
                  </h2>
                </div>
                <div className="flex gap-3 sm:gap-4 w-full">
                {/* Thumbnail strip */}
                <div className="flex flex-col ml-3 gap-3">
                  {thumbSlots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveThumb(i)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                        activeThumb === i ? 'border-primary' : 'border-border/30 hover:border-border'
                      }`}
                    >
                      <img
                        src={slot}
                        alt={`View ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={64}
                        height={64}
                      />
                      
                    </button>
                  ))}
                </div>

                {/* Main image */}
                <div className="flex-1 min-w-0 ml-10 max-w-[800px] rounded-3xl overflow-hidden bg-card border border-border/40 aspect-square relative shadow-[0_16px_50px_hsl(0_0%_0%_/_0.08)]">
                  <img
                    src={thumbSlots[activeThumb]}
                    alt={activeVariant.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    width={700}
                    height={525}
                  />
                  
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {activeThumb + 1} / {thumbSlots.length}
                    </span>
                  </div>
                </div>
                </div>
              </div>

              {/* ── RIGHT: Product info ── */}
              <div className="flex-1 min-w-0 p-1 sm:p-3 lg:pl-2 lg:pr-0 lg:pt-[76px]">
                {/* Description */}
                <p className="text-foreground/60 text-base leading-relaxed mb-8 mt-0">
                  {activeVariant.description}
                </p>

                <div className="mb-7">
                  <p className="text-xs font-bold tracking-widest uppercase text-foreground/50 mb-3">POWER</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {visibleCategories.map((cat) => {
                      const isActive = cat.id === activeVariantId;
                      const power = cat.specs.find((s) => s.label === 'Output Power')?.value ?? cat.label;
                      const supply = cat.specs.find((s) => s.label === 'Supply')?.value ?? '';
                      return (
                        <button
                          key={cat.id}
                          onClick={() => { setActiveVariantId(cat.id); setActiveThumb(0); }}
                            className={`flex flex-col items-start px-4 py-4 rounded-2xl border-2 transition-all duration-200 min-w-0 text-left ${
                            isActive
                              ? 'border-primary bg-primary/5'
                              : 'border-border/40 hover:border-border bg-card'
                          }`}
                        >
                          <span className={`text-lg font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                            {power}
                          </span>
                          <span className="text-xs text-foreground/50 mt-0.5">{supply}</span>
                          <span className="text-xs font-semibold text-foreground/70 mt-1">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Specs grid */}
                <div className="mb-8">
                  <p className="text-xs font-bold tracking-widest uppercase text-foreground/50 mb-3">SPECIFICATIONS</p>
                  <div className="grid grid-cols-2 gap-3">
                    {products.categories.map((cat) => (
                      <div key={cat.id} className={cat.id === activeVariantId ? 'contents' : 'hidden'}>
                        {cat.specs.slice(0, 4).map((spec) => (
                          <div key={spec.id} className="bg-background/70 border border-border/40 rounded-2xl p-4">
                            <div className="text-foreground/40 text-xs uppercase tracking-wider mb-1">{spec.label}</div>
                            <div className="text-foreground font-semibold text-sm">{spec.value}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <Link
                    to={`/products/${activeVariant.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
                  >
                    View full specifications <ChevronRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="mt-5 flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-primary/20"
                    style={{ background: 'hsl(var(--primary))' }}
                  >
                    <Zap size={16} />
                    Request a Quote
                    <ChevronRight size={16} />
                  </Link>
                  <p className="text-center text-xs text-foreground/40 mt-3">
                    Our team will get back to you within 24 hours
                  </p>
                </div>

              </div>
            </motion.div>
            {chargerType !== 'portable' && activeVariant.features?.length ? (
              <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 sm:p-6">
                <p className="text-xs font-bold tracking-widest uppercase text-foreground/50 mb-4">KEY FEATURES</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {activeVariant.features.map((feature) => (
                    <div key={feature.id} className="flex items-start gap-2.5 text-sm text-foreground/75 leading-relaxed">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        
        {/* CTA Banner */}
        <section className="py-20 bg-background border-t border-border/20" aria-label="Contact CTA">
          <div className="mx-auto w-full max-w-3xl px-6 sm:px-10 text-center">
            <h2 className="mt-0 text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">{products.cta.headline}</h2>
            <p className="text-foreground/60 text-base mb-8 max-w-xl mx-auto">{products.cta.subheading}</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90"
              style={{ background: 'hsl(var(--primary))' }}
            >
              {products.cta.ctaLabel}
              <ChevronRight size={14} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
