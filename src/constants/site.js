/**
 * Single source of truth for identity, SEO and contact data.
 *
 * ─────────────────────────────────────────────────────────────
 * DEPLOYING TO A DIFFERENT DOMAIN?
 * Change SITE.url here, then run:  npm run seo:sync
 * That rewrites the domain across index.html, robots.txt,
 * sitemap.xml and llms.txt in one pass.
 * ─────────────────────────────────────────────────────────────
 */

export const SITE = {
  name: "Ajith S",
  shortName: "Ajith S",
  logo: "/media/icons/brand.png",
  url: "https://ajith.nexverrtech.com",
  role: "3D Animator · VFX Artist · Unreal Engine",
  tagline: "Every frame tells a story, every motion sparks emotion.",
  description:
    "Ajith S — 3D animator and Unreal Engine artist in Chennai, India. 3D animation, CGI visual effects, virtual production and real-time cinematics, worldwide.",

  location: {
    city: "Chennai",
    region: "Tamil Nadu",
    regionCode: "IN-TN",
    country: "India",
    countryCode: "IN",
    lat: 13.0827,
    lng: 80.2707,
    label: "Chennai, Tamil Nadu · Working worldwide",
    timezone: "IST (UTC+5:30)",
  },

  contact: {
    phoneDisplay: "+91 63848 21366",
    whatsapp: "https://wa.me/916384821366",
    responseTime: "Usually replies within one working day",
  },

  socials: [
    { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/916384821366" },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/_ajithsankar_?igsh=MTZrcDFoOHd6YWtz&utm_source=qr",
    },
    {
      id: "youtube",
      label: "YouTube",
      href: "https://youtube.com/@ajith_sankar?si=JRVjyzQDTY7PiXGX",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ajith-s-357385325",
    },
  ],

  // EmailJS credentials — public by design (client-side SDK).
  email: {
    serviceId: "service_4ol3bz6",
    templateId: "template_k6xmjea",
    publicKey: "ucsodDXArpm-bq-82",
  },
};

export default SITE;
