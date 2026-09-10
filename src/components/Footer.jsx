import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

import { styles } from "../styles";
import { navLinks, services, SITE } from "../constants";

const SOCIAL_ICONS = {
  whatsapp: IoLogoWhatsapp,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
};

/**
 * Footer doubles as an SEO surface: it repeats the service names, the city and
 * the entity description as crawlable text, and it's the only place the
 * service keywords appear as plain links.
 */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-10 border-t border-white/[.07] bg-ink-950/60">
      <div className={`${styles.paddingX} ${styles.container} py-14 sm:py-16`}>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <a href="#top" className="flex w-fit items-center gap-2.5">
              <img
                src={SITE.logo}
                alt=""
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="h-9 w-9 object-contain"
              />
              <span className="font-display text-[16px] font-bold text-white">
                StoryRig<span className="text-violet"> Studio</span>
              </span>
            </a>

            <p className="max-w-xs text-[13.5px] leading-relaxed text-secondary">
              A 3D animation, visual effects and virtual production studio led by{" "}
              {SITE.founder}, building real-time cinematics in Unreal Engine 5 and Blender
              from {SITE.location.city}, {SITE.location.region}.
            </p>

            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-secondary/80">
              {SITE.location.label}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-soft/80">
              Explore
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {navLinks.map((nav) => (
                <li key={nav.id}>
                  <a
                    href={`#${nav.id}`}
                    className="inline-block py-1 text-[14px] text-secondary transition-colors hover:text-white"
                  >
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services — keyword-bearing text links */}
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-soft/80">
              Services
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.title}>
                  <a
                    href="#services"
                    className="inline-block py-1 text-[14px] text-secondary transition-colors hover:text-white"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#services"
                  className="inline-block py-1 text-[14px] text-secondary transition-colors hover:text-white"
                >
                  Video Editing
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-soft/80">
              Start something
            </h2>

            <a
              href={SITE.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block font-display text-lg font-bold text-white transition-colors hover:text-violet-soft"
            >
              {SITE.contact.phoneDisplay}
            </a>
            <p className="mt-2 text-[13px] text-secondary">{SITE.contact.responseTime}</p>

            <div className="mt-6 flex items-center gap-2.5">
              {SITE.socials.map(({ id, label, href }) => {
                const Icon = SOCIAL_ICONS[id];
                if (!Icon) return null;
                return (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE.name} on ${label}`}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.03] text-secondary transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:text-white"
                  >
                    <Icon size={17} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/[.07] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] text-secondary">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="text-[12.5px] text-secondary/80">
            {SITE.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
