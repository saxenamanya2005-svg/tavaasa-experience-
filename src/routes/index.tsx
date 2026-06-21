import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";

import arches from "@/assets/gallery/arches.png";
import exterior from "@/assets/gallery/exterior.png";
import interiorWide from "@/assets/gallery/interior-wide.png";
import specialtyCoffee from "@/assets/gallery/specialty-coffee.png";
import windowView from "@/assets/gallery/window-view.png";
import pasta from "@/assets/gallery/pasta.png";
import pizza from "@/assets/gallery/pizza.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tavaasa Café — Where Great Coffee Meets Great Conversations" },
      {
        name: "description",
        content:
          "Tavaasa Café on Chakrata Road, Dehradun. Specialty coffee, elegant interiors, and warm hospitality. Dine-in, takeaway and delivery. Reserve a table.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: TavaasaHome,
});

const GALLERY: { src: string; alt: string; tall?: boolean }[] = [
  { src: arches, alt: "Arched windows with olive trees and pendant lights", tall: true },
  { src: specialtyCoffee, alt: "Tavaasa specialty coffee in a branded cup" },
  { src: interiorWide, alt: "Spacious wooden interior of Tavaasa Café" },
  { src: pasta, alt: "Handmade primavera pasta with fresh herbs", tall: true },
  { src: exterior, alt: "Tavaasa Café exterior at dusk with warm uplighting" },
  { src: pizza, alt: "Wood-fired margherita pizza with basil and olive oil" },
  { src: windowView, alt: "Sunset view from a Tavaasa window seat" },
];

const REVIEWS = [
  {
    name: "Manoj Madhavan",
    role: "Local Guide · 273 reviews",
    text:
      "One of our finest new restaurant discoveries. A grand space across two spacious floors, with beautiful décor, greenery, and thoughtfully designed seating that offers privacy at every table.",
    stars: 5,
  },
  {
    name: "Kritika Bhatia",
    role: "Local Guide · 76 reviews",
    text:
      "A cozy café with a warm, inviting vibe perfect for coffee lovers. The bakery items truly stand out — fresh, flavorful, and absolutely worth trying. A great spot to sit and unwind.",
    stars: 5,
  },
  {
    name: "Anna Chua",
    role: "Verified diner",
    text:
      "Pizza is amazing — dough is fluffy, happiness in every bite. The tiramisu is the best I've found in Dehradun. The window seat at sunset is unbeatable.",
    stars: 5,
  },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function TavaasaHome() {
  useReveal();
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? 0 : (i + 1) % GALLERY.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i === null ? 0 : (i - 1 + GALLERY.length) % GALLERY.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <About />
      <Signature />
      <Gallery onOpen={(i) => setLightbox(i)} />
      <Reviews />
      <Ambience />
      <Visit />
      <Reserve />
      <Footer />

      {lightbox !== null && (
        <Lightbox
          index={lightbox}
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox((i) => (i === null ? 0 : (i - 1 + GALLERY.length) % GALLERY.length))}
          onNext={() => setLightbox((i) => (i === null ? 0 : (i + 1) % GALLERY.length))}
        />
      )}
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["About", "#about"],
    ["Experience", "#signature"],
    ["Gallery", "#gallery"],
    ["Reviews", "#reviews"],
    ["Visit", "#visit"],
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-md bg-background/80 border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight text-espresso">tavaasa</span>
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        </a>
        <nav className="hidden items-center gap-9 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[13px] uppercase tracking-[0.18em] text-espresso/70 transition-colors hover:text-gold"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#reserve"
          className="hidden rounded-full border border-espresso/80 px-5 py-2.5 text-[12px] uppercase tracking-[0.2em] text-espresso transition-all hover:bg-espresso hover:text-cream md:inline-block"
        >
          Reserve
        </a>
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-espresso/30 md:hidden"
        >
          <div className="space-y-1.5">
            <span className={`block h-px w-5 bg-espresso transition ${open ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-espresso transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-espresso transition ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-4">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 py-3 text-sm uppercase tracking-[0.2em] text-espresso/80"
              >
                {label}
              </a>
            ))}
            <a
              href="#reserve"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-espresso px-5 py-3 text-[12px] uppercase tracking-[0.2em] text-cream"
            >
              Reserve a Table
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={arches}
          alt="Tavaasa Café arched windows and warm interior"
          className="kenburns h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/40 via-espresso/30 to-espresso/80" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex-1" />
        <div className="mx-auto w-full max-w-6xl px-6 pb-24 sm:pb-32 md:px-10">
          <div className="max-w-3xl text-cream fade-up">
            <p className="eyebrow text-gold-soft">
              <span>Dehradun</span>
              <span className="gold-rule" />
              <span>Est. Chakrata Road</span>
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.02] text-balance">
              Where great coffee
              <br />
              meets <em className="not-italic text-gold-soft">great conversations.</em>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream/85 sm:text-base">
              A quiet, light-filled sanctuary on Chakrata Road — arched windows, slow mornings,
              warm hospitality, and a kitchen that takes its time.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#reserve"
                className="group inline-flex items-center gap-3 rounded-full bg-cream px-7 py-3.5 text-[12px] uppercase tracking-[0.22em] text-espresso transition-all hover:bg-gold"
              >
                Reserve a Table
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#gallery"
                className="text-[12px] uppercase tracking-[0.22em] text-cream/80 underline-offset-8 hover:underline"
              >
                Explore the Space
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-cream/60">Scroll</span>
            <div className="relative h-10 w-px overflow-hidden bg-cream/20">
              <span className="scroll-dot absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-gold" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  intro,
  light,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center reveal">
      <p className={`eyebrow ${light ? "text-gold-soft" : ""}`}>{eyebrow}</p>
      <h2
        className={`mt-5 font-display text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] text-balance ${
          light ? "text-cream" : "text-espresso"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed sm:text-base ${
          light ? "text-cream/80" : "text-coffee"
        }`}>
          {intro}
        </p>
      )}
    </div>
  );
}

function About() {
  return (
    <section id="about" className="relative bg-cream py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-12 md:gap-16 md:px-10">
        <div className="md:col-span-5 reveal">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-elegant">
            <img src={interiorWide} alt="Tavaasa interior, wooden chairs and pendant lights" className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 flex items-center gap-3 text-coffee/80">
            <span className="h-px flex-1 bg-coffee/30" />
            <span className="font-display italic text-coffee">a quiet pause in Dehradun</span>
            <span className="h-px flex-1 bg-coffee/30" />
          </div>
        </div>

        <div className="md:col-span-7 md:pt-10 reveal">
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-espresso text-balance">
            A house built for conversation, coffee, and slow afternoons.
          </h2>
          <div className="mt-8 space-y-5 text-[15.5px] leading-[1.85] text-coffee">
            <p>
              Tavaasa began with a simple wish — a beautiful, unhurried space where
              Dehradun could gather. Two spacious floors, arched windows that frame the
              eucalyptus outside, and seating designed so every table feels like its own
              quiet corner.
            </p>
            <p>
              Our coffee is roasted for nuance, our kitchen leans into wood-fire and
              fresh produce, and our team is here to make you feel like you've been
              expected all along.
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-coffee/15 pt-8">
            {[
              ["4.3★", "3,748 reviews"],
              ["2", "spacious floors"],
              ["08:00", "open daily"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-display text-3xl text-espresso">{k}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-coffee/70">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Signature() {
  const items = [
    { t: "Specialty Coffee", d: "Single-origin beans, dialled-in daily by hand." },
    { t: "Wood-Fired Kitchen", d: "Sourdough pizzas, handmade pastas, seasonal plates." },
    { t: "Elegant Interiors", d: "Arched windows, warm woods, considered lighting." },
    { t: "Warm Hospitality", d: "A team trained to anticipate, not interrupt." },
    { t: "Quiet Seating", d: "Tables placed for privacy and easy conversation." },
    { t: "All-Day Energy", d: "From quiet mornings to candle-lit evenings." },
  ];
  return (
    <section id="signature" className="relative overflow-hidden bg-espresso py-24 text-cream sm:py-32 grain">
      <SectionHeader
        eyebrow="The Signature Experience"
        title={
          <>
            Six small details that make
            <br /> the whole evening land.
          </>
        }
        intro="Tavaasa isn't loud about it. The experience is in the texture of the cup, the weight of the chair, the way the room hushes at sunset."
        light
      />
      <div className="mx-auto mt-16 grid max-w-7xl gap-px overflow-hidden rounded-sm border border-cream/10 bg-cream/10 px-6 md:grid-cols-3 md:px-10">
        {items.map((it, i) => (
          <div
            key={it.t}
            className="reveal bg-espresso p-8 sm:p-10 transition-colors hover:bg-espresso/60"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span className="font-display text-gold/80 text-sm">0{i + 1}</span>
            <h3 className="mt-4 font-display text-2xl text-cream">{it.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Gallery({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <section id="gallery" className="relative bg-bone py-24 sm:py-32">
      <SectionHeader
        eyebrow="The Gallery"
        title={<>Inside the room.</>}
        intro="A walk-through of the space, the light, and the table."
      />
      <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 md:px-10">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {GALLERY.map((img, i) => (
            <button
              key={i}
              onClick={() => onOpen(i)}
              className="reveal group mb-4 block w-full overflow-hidden rounded-sm bg-muted shadow-soft transition-transform duration-500 hover:-translate-y-1 hover:shadow-elegant"
              style={{ breakInside: "avoid" }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] ${
                    img.tall ? "aspect-[3/4]" : "aspect-[4/5]"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-3 left-3 translate-y-2 text-xs uppercase tracking-[0.2em] text-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  View
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Lightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = GALLERY[index];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/95 p-4 fade-in" onClick={onClose}>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream hover:bg-cream hover:text-espresso"
      >
        ✕
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous"
        className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 text-cream hover:bg-cream hover:text-espresso sm:flex"
      >
        ‹
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next"
        className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 text-cream hover:bg-cream hover:text-espresso sm:flex"
      >
        ›
      </button>
      <figure className="max-h-[88vh] max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <img src={img.src} alt={img.alt} className="max-h-[80vh] w-auto rounded-sm object-contain" />
        <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.25em] text-cream/70">
          {img.alt} · {index + 1} / {GALLERY.length}
        </figcaption>
      </figure>
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="relative bg-cream py-24 sm:py-32">
      <SectionHeader
        eyebrow="Guest Notes"
        title={<>Loved by 3,748+ guests.</>}
        intro="Rated 4.3★ on Google. Honest words from people who've shared our tables."
      />
      <div className="mx-auto mt-16 grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3 md:px-10">
        {REVIEWS.map((r, i) => (
          <article
            key={r.name}
            className="reveal relative flex flex-col rounded-sm border border-coffee/15 bg-background p-8 shadow-soft transition-transform duration-500 hover:-translate-y-1"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <span className="absolute -top-5 left-7 font-display text-7xl leading-none text-gold/60">“</span>
            <div className="flex gap-1 text-gold">
              {Array.from({ length: r.stars }).map((_, j) => (
                <span key={j}>★</span>
              ))}
            </div>
            <p className="mt-5 flex-1 text-[15px] leading-[1.8] text-coffee">{r.text}</p>
            <footer className="mt-6 border-t border-coffee/15 pt-4">
              <div className="font-display text-lg text-espresso">{r.name}</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-coffee/60">{r.role}</div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function Ambience() {
  return (
    <section className="relative overflow-hidden bg-forest text-cream">
      <div className="absolute inset-0">
        <img src={specialtyCoffee} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/85 via-forest/90 to-espresso/95" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-24 md:grid-cols-2 md:py-32 md:px-10">
        <div className="reveal">
          <p className="eyebrow text-gold-soft">Ambience & Space</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.05] text-balance text-cream">
            Greenery, soft light, and a long quiet exhale.
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-[1.85] text-cream/80">
            Potted olive trees by the windows. Hand-thrown ceramics on the counter.
            The hum of the espresso machine, the rustle of newspaper, the unhurried
            clink of a cup returning to its saucer.
          </p>
          <ul className="mt-10 space-y-4 text-cream/85">
            {[
              "Two spacious, light-filled floors",
              "Arched windows opening to FRI's tree line",
              "Hand-picked wood and stone interiors",
              "Plant-lined corners and warm pendant glow",
              "Quiet acoustics, considered for conversation",
            ].map((l) => (
              <li key={l} className="flex items-start gap-3">
                <span className="mt-2 h-px w-6 shrink-0 bg-gold" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal grid grid-cols-2 gap-4 self-center">
          <img src={arches} alt="Arched windows" className="aspect-[3/4] w-full rounded-sm object-cover shadow-elegant" />
          <img src={windowView} alt="Window view at sunset" className="mt-12 aspect-[3/4] w-full rounded-sm object-cover shadow-elegant" />
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section id="visit" className="relative bg-background py-24 sm:py-32">
      <SectionHeader
        eyebrow="Visit Us"
        title={<>Find your seat by the window.</>}
        intro="Opposite FRI on Chakrata Road. There's almost always a corner waiting."
      />
      <div className="mx-auto mt-16 grid max-w-7xl gap-10 px-6 md:grid-cols-5 md:px-10">
        <div className="md:col-span-2 reveal">
          <div className="space-y-8">
            <Info label="Address">
              01, Chakrata Rd, opposite FRI,<br />
              Raj Vihar, Balliwala,<br />
              Dehradun, Uttarakhand 248001
            </Info>
            <Info label="Phone">
              <a href="tel:+917455034126" className="text-espresso underline-offset-4 hover:text-gold hover:underline">
                +91 74550 34126
              </a>
            </Info>
            <Info label="Hours">
              Open daily<br />
              08:00 — 22:30
            </Info>
            <Info label="Services">Dine-in · Takeaway · No-contact delivery</Info>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Tavaasa+Cafe+Chakrata+Road+Dehradun"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-[12px] uppercase tracking-[0.22em] text-cream transition-all hover:bg-coffee"
            >
              Get Directions →
            </a>
            <a
              href="tel:+917455034126"
              className="inline-flex items-center gap-2 rounded-full border border-espresso/70 px-6 py-3 text-[12px] uppercase tracking-[0.22em] text-espresso hover:bg-espresso hover:text-cream"
            >
              Call Us
            </a>
          </div>
        </div>
        <div className="reveal md:col-span-3">
          <div className="overflow-hidden rounded-sm border border-border shadow-soft">
            <iframe
              title="Tavaasa Café location map"
              src="https://www.google.com/maps?q=Tavaasa+Cafe+Chakrata+Road+Dehradun&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[460px] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className="mt-3 text-[15px] leading-[1.8] text-coffee">{children}</div>
    </div>
  );
}

function Reserve() {
  const [sent, setSent] = useState<"reserve" | "contact" | null>(null);
  const reserveRef = useRef<HTMLFormElement>(null);
  const contactRef = useRef<HTMLFormElement>(null);

  const submit = (which: "reserve" | "contact") => (e: FormEvent) => {
    e.preventDefault();
    setSent(which);
    setTimeout(() => setSent(null), 4000);
    (which === "reserve" ? reserveRef : contactRef).current?.reset();
  };

  return (
    <section id="reserve" className="relative bg-bone py-24 sm:py-32">
      <SectionHeader
        eyebrow="Reservations & Contact"
        title={<>Save your table.</>}
        intro="Tell us when you're coming and we'll have the room ready."
      />
      <div className="mx-auto mt-16 grid max-w-6xl gap-8 px-6 md:grid-cols-2 md:px-10">
        <form
          ref={reserveRef}
          onSubmit={submit("reserve")}
          className="reveal rounded-sm border border-coffee/15 bg-background p-8 shadow-soft sm:p-10"
        >
          <h3 className="font-display text-2xl text-espresso">Reserve a Table</h3>
          <p className="mt-2 text-sm text-coffee/80">We confirm within the hour during open times.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" required />
            <Field label="Phone" name="phone" type="tel" required />
            <Field label="Date" name="date" type="date" required />
            <Field label="Time" name="time" type="time" required />
            <Field label="Guests" name="guests" type="number" min={1} max={20} defaultValue={2} required />
            <Field label="Email" name="email" type="email" />
          </div>
          <label className="mt-4 block">
            <span className="eyebrow">Notes</span>
            <textarea
              name="notes"
              rows={3}
              className="mt-2 w-full rounded-sm border border-coffee/20 bg-cream/60 px-4 py-3 text-sm text-espresso outline-none transition focus:border-gold focus:bg-cream"
              placeholder="Window seat, anniversary, anything we should know…"
            />
          </label>
          <button className="mt-6 w-full rounded-full bg-espresso px-6 py-3.5 text-[12px] uppercase tracking-[0.22em] text-cream transition-all hover:bg-coffee">
            {sent === "reserve" ? "Request sent ✓" : "Request Reservation"}
          </button>
        </form>

        <form
          ref={contactRef}
          onSubmit={submit("contact")}
          className="reveal rounded-sm border border-coffee/15 bg-espresso p-8 text-cream shadow-soft sm:p-10"
        >
          <h3 className="font-display text-2xl text-cream">Say Hello</h3>
          <p className="mt-2 text-sm text-cream/70">Private events, press, or simply a kind word.</p>
          <div className="mt-6 grid gap-4">
            <Field label="Name" name="cname" required dark />
            <Field label="Email" name="cemail" type="email" required dark />
            <label className="block">
              <span className="eyebrow text-gold-soft">Message</span>
              <textarea
                name="message"
                rows={5}
                required
                className="mt-2 w-full rounded-sm border border-cream/20 bg-cream/5 px-4 py-3 text-sm text-cream outline-none transition focus:border-gold focus:bg-cream/10"
              />
            </label>
          </div>
          <button className="mt-6 w-full rounded-full bg-gold px-6 py-3.5 text-[12px] uppercase tracking-[0.22em] text-espresso transition-all hover:bg-cream">
            {sent === "contact" ? "Message sent ✓" : "Send Message"}
          </button>
          <div className="mt-6 flex items-center gap-5 text-cream/80">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.22em] hover:text-gold">Instagram</a>
            <span className="h-px w-6 bg-cream/30" />
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.22em] hover:text-gold">Facebook</a>
            <span className="h-px w-6 bg-cream/30" />
            <a href="tel:+917455034126" className="text-xs uppercase tracking-[0.22em] hover:text-gold">Call</a>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", required, defaultValue, min, max, dark,
}: {
  label: string; name: string; type?: string; required?: boolean;
  defaultValue?: string | number; min?: number; max?: number; dark?: boolean;
}) {
  return (
    <label className="block">
      <span className={`eyebrow ${dark ? "text-gold-soft" : ""}`}>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        min={min}
        max={max}
        className={
          dark
            ? "mt-2 w-full rounded-sm border border-cream/20 bg-cream/5 px-4 py-3 text-sm text-cream outline-none transition focus:border-gold focus:bg-cream/10"
            : "mt-2 w-full rounded-sm border border-coffee/20 bg-cream/60 px-4 py-3 text-sm text-espresso outline-none transition focus:border-gold focus:bg-cream"
        }
      />
    </label>
  );
}

function Footer() {
  return (
    <footer className="relative bg-espresso text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-cream">tavaasa</span>
            <span className="h-2 w-2 rounded-full bg-gold" />
          </div>
          <p className="mt-4 max-w-md text-sm leading-[1.85] text-cream/70">
            A premium café & restaurant on Chakrata Road, Dehradun. Specialty coffee,
            warm hospitality, and a beautiful room for the people you love.
          </p>
        </div>
        <div>
          <p className="eyebrow text-gold-soft">Visit</p>
          <p className="mt-4 text-sm leading-[1.85]">
            01, Chakrata Rd, opposite FRI<br />
            Raj Vihar, Balliwala<br />
            Dehradun, Uttarakhand 248001
          </p>
        </div>
        <div>
          <p className="eyebrow text-gold-soft">Hours & Contact</p>
          <p className="mt-4 text-sm leading-[1.85]">
            Open daily · 08:00 — 22:30<br />
            <a href="tel:+917455034126" className="hover:text-gold">+91 74550 34126</a><br />
            <a href="#reserve" className="hover:text-gold">Reservations</a>
          </p>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs uppercase tracking-[0.22em] text-cream/50 sm:flex-row md:px-10">
          <div>© {new Date().getFullYear()} Tavaasa Café · Dehradun</div>
          <div className="flex gap-5">
            <a href="#about" className="hover:text-gold">About</a>
            <a href="#gallery" className="hover:text-gold">Gallery</a>
            <a href="#visit" className="hover:text-gold">Visit</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
