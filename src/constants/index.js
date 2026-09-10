/**
 * Icons are served from /public/media/icons — generated at 256px by
 * scripts/optimize-images.mjs. Importing the masters instead pulled ~1.9 MB of
 * oversized PNGs into the bundle to render at 36px.
 */
const icon = (name) => `/media/icons/${name}.png`;

export { SITE } from "./site";

/* ------------------------------------------------------------------
   NAVIGATION
   ------------------------------------------------------------------ */
export const navLinks = [
  { id: "about", title: "About" },
  { id: "services", title: "Services" },
  { id: "experience", title: "Experience" },
  { id: "work", title: "Work" },
  { id: "faq", title: "FAQ" },
  { id: "contact", title: "Contact" },
];

/* ------------------------------------------------------------------
   HERO — rotating roles
   ------------------------------------------------------------------ */
const roles = [
  "3D Animation",
  "Visual Effects",
  "Virtual Production",
  "Real-time Cinematics",
];

/* ------------------------------------------------------------------
   STATS
   ------------------------------------------------------------------ */
const stats = [
  { value: 2, suffix: "+", label: "Years in production" },
  { value: 40, suffix: "+", label: "Shots delivered" },
  { value: 9, suffix: "", label: "Tools in the pipeline" },
  { value: 100, suffix: "%", label: "Projects finished end to end" },
];

/* ------------------------------------------------------------------
   SERVICES
   ------------------------------------------------------------------ */
const services = [
  {
    title: "Animation",
    icon: icon("animation"),
    blurb:
      "Character, product and mechanical animation built to carry a story — from blocking and timing to final polish.",
    points: ["Character & creature", "Product & mechanical", "Motion graphics"],
  },
  {
    title: "Visual Effects",
    icon: icon("vfx"),
    blurb:
      "CGI integration, simulation and compositing that sits inside the plate instead of floating on top of it.",
    points: ["CG integration", "Simulation & FX", "Compositing & clean-up"],
  },
  {
    title: "Virtual Production",
    icon: icon("led"),
    blurb:
      "LED-wall and in-camera VFX workflows: camera-tracked, real-time environments driven by Unreal Engine.",
    points: ["In-camera VFX", "Real-time environments", "Camera tracking"],
  },
  {
    title: "Game Design",
    icon: icon("creator"),
    blurb:
      "Playable and cinematic 3D worlds — level dressing, lighting and the optimisation pass that keeps them real-time.",
    points: ["Environment art", "Level dressing", "Lumen & Nanite tuning"],
  },
];

/* ------------------------------------------------------------------
   TOOLS
   ------------------------------------------------------------------ */
const technologies = [
  { name: "Unreal Engine", icon: icon("ue") },
  { name: "Blender", icon: icon("blender") },
  { name: "Substance Painter", icon: icon("pt") },
  { name: "After Effects", icon: icon("aftereffect") },
  { name: "DaVinci Resolve", icon: icon("davinci") },
  { name: "Premiere Pro", icon: icon("pp") },
  { name: "Photoshop", icon: icon("ps") },
  { name: "Illustrator", icon: icon("ai") },
  { name: "Figma", icon: icon("figma") },
];

/* ------------------------------------------------------------------
   PROCESS — how a project actually runs
   ------------------------------------------------------------------ */
const processSteps = [
  {
    step: "01",
    title: "Brief & board",
    copy: "We pin down the story, the references and the deliverable list, then board the key beats before a single asset is built.",
  },
  {
    step: "02",
    title: "Block & previs",
    copy: "Rough geometry, camera and timing go in first. You approve the motion before anything gets expensive to change.",
  },
  {
    step: "03",
    title: "Look development",
    copy: "Modelling, texturing, lighting and shading — the pass that decides whether a frame reads as real or as CG.",
  },
  {
    step: "04",
    title: "Render & finish",
    copy: "Render, composite, grade and sound. Delivered in the formats your platform actually needs.",
  },
];

/* ------------------------------------------------------------------
   EXPERIENCE
   ------------------------------------------------------------------ */
const experiences = [
  {
    title: "Animator",
    company_name: "Kaykee Digital Solution",
    icon: icon("edit"),
    iconBg: "#383E56",
    date: "Present",
    points: [
      "Creating impactful animations for YouTube, Instagram, and ad campaigns.",
      "Managing end-to-end production including editing, sound, and post-production.",
      "Delivering creative visual stories that boost brand communication and audience engagement.",
    ],
  },
  {
    title: "3D Artist & Editor",
    company_name: "Freelance",
    icon: icon("freelance"),
    iconBg: "#383E56",
    date: "Jan 2024 - Dec 2024",
    points: [
      "Creating immersive 3D animations and engaging video edits for YouTube to enhance storytelling and audience connection.",
      "Managing end-to-end production, including animation, editing, sound, and post-production for high-quality results.",
      "Collaborating with clients to bring creative visions to life, ensuring timely delivery aligned with branding and audience needs.",
    ],
  },
];

/* ------------------------------------------------------------------
   TESTIMONIALS
   Not rendered on the live site — real client quotes go here first.
   ------------------------------------------------------------------ */
const testimonials = [];

/* ------------------------------------------------------------------
   PROJECTS
   `category` drives the filter chips, `videoId` drives the lightbox.
   ------------------------------------------------------------------ */
const projects = [
  {
    name: "3D Island Environment",
    subtitle: "Unreal Engine 5.5",
    category: "Environments",
    year: "2025",
    description:
      "A real-time cinematic island built with Blender assets and lit inside Unreal Engine 5.5 — Lumen global illumination, Nanite geometry and a full sequencer camera pass.",
    tags: [
      { name: "Blender", color: "pink-text-gradient" },
      { name: "Unreal Engine 5", color: "green-text-gradient" },
      { name: "Lumen", color: "blue-text-gradient" },
    ],
    slug: "work-island",
    videoId: "GFBCzQBu5x8",
    source_code_link: "https://youtu.be/GFBCzQBu5x8?si=f4pPYs1P3ZnPoZ9V",
  },
  {
    name: "The Lord Ganesha — Cave Environment",
    subtitle: "Unreal Engine 5.5",
    category: "Environments",
    year: "2025",
    description:
      "A devotional cinematic sequence set inside a sculpted cave: hero asset modelled in Blender, atmosphere and volumetric lighting rendered in real time in Unreal Engine 5.5.",
    tags: [
      { name: "Blender", color: "pink-text-gradient" },
      { name: "Unreal Engine 5", color: "green-text-gradient" },
      { name: "Volumetrics", color: "orange-text-gradient" },
    ],
    slug: "work-ganesha",
    videoId: "3LgJpp9kmz8",
    source_code_link: "https://youtu.be/3LgJpp9kmz8?si=L4jOR0H8R72_KTIc",
  },
  {
    name: "CGI Airplane Animation",
    subtitle: "Blender 4.4",
    category: "Animation",
    year: "2025",
    description:
      "A full CGI aircraft sequence — hard-surface modelling, flight animation and cloud atmosphere rendered in Blender 4.4, then graded and finished in DaVinci Resolve.",
    tags: [
      { name: "Blender", color: "pink-text-gradient" },
      { name: "DaVinci Resolve", color: "green-text-gradient" },
      { name: "Simulation", color: "blue-text-gradient" },
    ],
    slug: "work-airplane",
    videoId: "P6q2SZ8of5k",
    source_code_link: "https://youtu.be/P6q2SZ8of5k?si=KAPnJ2JNy7iSM1fb",
  },
  {
    name: "Mustang GT — Automotive CGI",
    subtitle: "Blender 4.4",
    category: "Product & CGI",
    year: "2025",
    description:
      "Photoreal automotive CGI produced end to end in Blender 4.4: hard-surface modelling, studio and HDRI lighting, car-paint shading and final compositing.",
    tags: [
      { name: "Blender", color: "pink-text-gradient" },
      { name: "Automotive", color: "green-text-gradient" },
      { name: "Lighting", color: "orange-text-gradient" },
    ],
    slug: "work-mustang",
    videoId: "afrmrC4tAkg",
    source_code_link: "https://youtu.be/afrmrC4tAkg?si=k3PyZFgm8R9bUc3B",
  },
];

/* ------------------------------------------------------------------
   FAQ
   These answers are mirrored in the FAQPage JSON-LD in index.html and
   in /public/llms.txt. Edit all three together — Google requires the
   schema answer to match what a visitor can actually read.
   ------------------------------------------------------------------ */
const faqs = [
  {
    q: "What does StoryRig Studio do?",
    a: "StoryRig Studio produces 3D animation, CGI visual effects, real-time cinematics and virtual production content, primarily in Unreal Engine 5 and Blender, for brands, creators and film projects.",
  },
  {
    q: "Where is StoryRig Studio located?",
    a: "StoryRig Studio is based in Chennai, Tamil Nadu, India, and works remotely with clients across India and internationally.",
  },
  {
    q: "Which software does StoryRig Studio use?",
    a: "Unreal Engine 5.5 and Blender 4.4 for 3D and real-time rendering, DaVinci Resolve and Adobe Premiere Pro for edit and colour grade, After Effects for motion graphics and compositing, Substance Painter for texturing, and Photoshop and Illustrator for design.",
  },
  {
    q: "How long does a 3D animation project take?",
    a: "A short product or logo animation typically takes one to two weeks. A full cinematic environment or a longer CGI sequence usually runs three to six weeks, depending on shot count, asset complexity and the number of revision rounds.",
  },
  {
    q: "Does StoryRig Studio work with clients outside India?",
    a: "Yes. Projects are delivered remotely worldwide, with review cycles handled over video call and shared links.",
  },
  {
    q: "How do I get a quote from StoryRig Studio?",
    a: "Send your brief, reference material and deadline through the contact form on this page or message WhatsApp +91 63848 21366. You will normally get a scope and quote back within one working day.",
  },
];

export {
  roles,
  stats,
  services,
  technologies,
  processSteps,
  experiences,
  testimonials,
  projects,
  faqs,
};
