import { Suspense, lazy, useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

import { SITE } from "../constants";
import { SectionWrapper } from "../hoc";
import SectionHeading from "./SectionHeading";
import Toast from "./Toast";
import { useCanRender3D } from "../hooks";
import { listContainer, revealUp, scaleReveal } from "../utils/motion";

const EarthCanvas = lazy(() => import("./canvas/Earth"));

const PROJECT_TYPES = [
  "3D Animation",
  "Visual Effects",
  "Virtual Production",
  "Game / Environment",
  "Video Editing",
  "Something else",
];

const SOCIAL_ICONS = {
  whatsapp: { Icon: IoLogoWhatsapp, hover: "hover:text-[#25D366]" },
  instagram: { Icon: FaInstagram, hover: "hover:text-[#E1306C]" },
  youtube: { Icon: FaYoutube, hover: "hover:text-[#FF0000]" },
  linkedin: { Icon: FaLinkedin, hover: "hover:text-[#0A66C2]" },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validate = (form) => {
  const errors = {};
  if (!form.from_name.trim()) errors.from_name = "Please tell me your name.";
  else if (form.from_name.trim().length < 2) errors.from_name = "That looks a bit short.";

  if (!form.from_email.trim()) errors.from_email = "I need an email to reply to.";
  else if (!EMAIL_RE.test(form.from_email.trim()))
    errors.from_email = "That email doesn't look right.";

  if (!form.message.trim()) errors.message = "Tell me a little about the project.";
  else if (form.message.trim().length < 12)
    errors.message = "A couple more words would help me scope it.";

  return errors;
};

const Field = ({ label, error, children, hint }) => (
  <label className="flex flex-col gap-2">
    <span className="flex items-baseline justify-between gap-3">
      <span className="text-[13px] font-medium text-white">{label}</span>
      {hint ? <span className="text-[11px] text-secondary">{hint}</span> : null}
    </span>
    {children}
    {error ? (
      <span className="text-[12px] font-medium text-red-300" role="alert">
        {error}
      </span>
    ) : null}
  </label>
);

const inputClass = (hasError) =>
  `w-full rounded-xl border bg-white/[.03] px-5 py-3.5 text-[15px] text-white placeholder:text-secondary/70 outline-none transition-colors duration-300 focus:border-violet focus:bg-white/[.06] ${
    hasError ? "border-red-400/60" : "border-white/10"
  }`;

const Contact = () => {
  const canRender3D = useCanRender3D();
  const formRef = useRef(null);

  const [form, setForm] = useState({
    from_name: "",
    from_email: "",
    project_type: PROJECT_TYPES[0],
    message: "",
    // Honeypot — real people never see this, bots fill it in.
    company_website: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Silently accept and discard bot submissions.
    if (form.company_website) return;

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      formRef.current
        ?.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)
        ?.focus();
      return;
    }

    setLoading(true);

    /**
     * Sent with send() rather than sendForm() so the payload matches the
     * existing EmailJS template exactly — it renders {{from_name}},
     * {{from_email}} and {{message}}. The project type is folded into the
     * message body so no template change is needed to receive it.
     */
    emailjs
      .send(
        SITE.email.serviceId,
        SITE.email.templateId,
        {
          from_name: form.from_name.trim(),
          from_email: form.from_email.trim(),
          message: `Project type: ${form.project_type}\n\n${form.message.trim()}`,
        },
        SITE.email.publicKey
      )
      .then(
        () => {
          setLoading(false);
          setToast({
            type: "success",
            message: `Thanks ${form.from_name.trim().split(" ")[0]} — your brief landed. ${SITE.contact.responseTime}.`,
          });
          setForm({
            from_name: "",
            from_email: "",
            project_type: PROJECT_TYPES[0],
            message: "",
            company_website: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          setToast({
            type: "error",
            message: "That didn't send. Try WhatsApp instead — it always gets through.",
          });
        }
      );
  };

  return (
    <>
      <SectionHeading
        id="contact"
        eyebrow="Get in touch"
        title="Got a shot in your head?"
        accent="Let's build it."
        intro={`Send a rough brief, a reference or two and your deadline. ${SITE.contact.responseTime}.`}
      />

      <div className="mt-12 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* ---------- Form ---------- */}
        <motion.div
          variants={revealUp(0)}
          className="gradient-border glass rounded-4xl p-7 sm:p-9"
        >
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Your name" error={errors.from_name}>
                <input
                  type="text"
                  name="from_name"
                  value={form.from_name}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="What should I call you?"
                  aria-invalid={Boolean(errors.from_name)}
                  className={inputClass(errors.from_name)}
                />
              </Field>

              <Field label="Your email" error={errors.from_email}>
                <input
                  type="email"
                  name="from_email"
                  value={form.from_email}
                  onChange={handleChange}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="where.should.i@reply.com"
                  aria-invalid={Boolean(errors.from_email)}
                  className={inputClass(errors.from_email)}
                />
              </Field>
            </div>

            <Field label="Project type">
              <select
                name="project_type"
                value={form.project_type}
                onChange={handleChange}
                className={`${inputClass(false)} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23aaa6c3' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_1.25rem_center] bg-no-repeat pr-12`}
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-ink-900 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="The brief"
              error={errors.message}
              hint={`${form.message.length} characters`}
            >
              <textarea
                rows={6}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What are we making, who's it for, and when do you need it?"
                aria-invalid={Boolean(errors.message)}
                className={`${inputClass(errors.message)} resize-y min-h-[140px]`}
              />
            </Field>

            {/* Honeypot */}
            <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>
                Company website
                <input
                  type="text"
                  name="company_website"
                  value={form.company_website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {loading ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      aria-hidden="true"
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    Send the brief
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-[12px] leading-relaxed text-secondary">
                Prefer to talk?{" "}
                <a
                  href={SITE.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-violet-soft underline decoration-violet/40 underline-offset-4 transition hover:text-white"
                >
                  WhatsApp {SITE.contact.phoneDisplay}
                </a>
              </p>
            </div>
          </form>
        </motion.div>

        {/* ---------- Globe + details ---------- */}
        <motion.div variants={listContainer(0.12)} className="flex flex-col gap-6">
          <motion.div
            variants={scaleReveal(0.1)}
            className="gradient-border glass relative h-[300px] overflow-hidden rounded-4xl sm:h-[380px] lg:h-[420px]"
          >
            {canRender3D ? (
              <Suspense fallback={null}>
                <EarthCanvas />
              </Suspense>
            ) : (
              // Static stand-in — no WebGL on phones or reduced-motion.
              <div className="relative grid h-full w-full place-items-center overflow-hidden">
                <div className="aurora" aria-hidden="true" />
                <div
                  className="relative h-40 w-40 rounded-full border border-white/10 bg-gradient-to-br from-violet/35 via-ink-800 to-aqua/20 shadow-glow sm:h-52 sm:w-52"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(0deg,rgba(255,255,255,.09)_0_1px,transparent_1px_18px),repeating-linear-gradient(90deg,rgba(255,255,255,.09)_0_1px,transparent_1px_18px)]" />
                </div>
                <p className="absolute bottom-6 font-mono text-[11px] uppercase tracking-[0.2em] text-secondary">
                  {SITE.location.city} → Worldwide
                </p>
              </div>
            )}
          </motion.div>

          {/* Contact details */}
          <motion.div
            variants={revealUp(0.15)}
            className="gradient-border glass rounded-4xl p-7 sm:p-8"
          >
            <dl className="grid grid-cols-1 gap-5 xs:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-soft/80">
                  Based in
                </dt>
                <dd className="mt-1.5 text-[14.5px] font-medium text-white">
                  {SITE.location.city}, {SITE.location.region}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-soft/80">
                  Working hours
                </dt>
                <dd className="mt-1.5 text-[14.5px] font-medium text-white">
                  Mon–Sat · {SITE.location.timezone}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-soft/80">
                  WhatsApp
                </dt>
                <dd className="mt-1.5 text-[14.5px] font-medium text-white">
                  <a
                    href={SITE.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1 transition hover:text-violet-soft"
                  >
                    {SITE.contact.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-soft/80">
                  Response
                </dt>
                <dd className="mt-1.5 text-[14.5px] font-medium text-white">
                  Within 1 working day
                </dd>
              </div>
            </dl>

            <div className="mt-7 flex items-center gap-3 border-t border-white/[.08] pt-6">
              {SITE.socials.map(({ id, label, href }) => {
                const entry = SOCIAL_ICONS[id];
                if (!entry) return null;
                const { Icon, hover } = entry;
                return (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE.name} on ${label}`}
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.03] text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/25 ${hover}`}
                  >
                    <Icon size={19} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
};

export default SectionWrapper(Contact, "contact");
