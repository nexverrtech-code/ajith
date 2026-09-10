import { technologies } from "../constants";

/**
 * Infinite tool marquee.
 *
 * The list is rendered twice inside a `w-max` track that translates by -50%,
 * so the loop is seamless. Pauses on hover; frozen entirely under
 * reduced-motion by the rule in index.css.
 */
const Marquee = () => {
  const items = [...technologies, ...technologies];

  return (
    <div className="marquee-wrap marquee-mask relative w-full overflow-hidden border-y border-white/[.06] bg-white/[.015] py-7">
      <div className="marquee marquee-track gap-12 sm:gap-16" aria-hidden="true">
        {items.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="flex shrink-0 items-center gap-3 opacity-55 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
          >
            <img
              src={tech.icon}
              alt=""
              width={30}
              height={30}
              loading="lazy"
              decoding="async"
              className="h-7 w-7 object-contain sm:h-8 sm:w-8"
            />
            <span className="whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.16em] text-white/80 sm:text-[13px]">
              {tech.name}
            </span>
          </div>
        ))}
      </div>

      {/* Text equivalent for assistive tech and crawlers */}
      <p className="sr-only">
        Tools used: {technologies.map((t) => t.name).join(", ")}.
      </p>
    </div>
  );
};

export default Marquee;
