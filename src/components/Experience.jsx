import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import SectionHeading from "./SectionHeading";

const ExperienceCard = ({ experience }) => (
  <VerticalTimelineElement
    contentStyle={{
      background: "rgba(13, 16, 36, .92)",
      color: "#fff",
      boxShadow: "0 24px 70px -30px rgba(0,0,0,.9)",
    }}
    contentArrowStyle={{ borderRight: "7px solid rgba(13, 16, 36, .92)" }}
    date={experience.date}
    iconStyle={{ background: experience.iconBg }}
    icon={
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={experience.icon}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-[60%] w-[60%] object-contain"
        />
      </div>
    }
  >
    <div>
      <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
        {experience.title}
      </h3>
      <p
        className="mt-1 font-mono text-[13px] uppercase tracking-[0.12em] text-violet-soft"
        style={{ margin: 0 }}
      >
        {experience.company_name}
      </p>
    </div>

    <ul className="ml-4 mt-5 list-disc space-y-2 marker:text-violet/70">
      {experience.points.map((point, index) => (
        <li
          key={`experience-point-${index}`}
          className="pl-1 text-[14px] leading-relaxed tracking-wide text-white-100/85"
        >
          {point}
        </li>
      ))}
    </ul>
  </VerticalTimelineElement>
);

const Experience = () => (
  <>
    <SectionHeading
      id="experience"
      align="center"
      eyebrow="What I have done so far"
      title="Work"
      accent="experience."
      intro="Two years of shipping animation and post for brands and creators — always end to end, from the first board to the delivered master."
    />

    <div className="mt-16 flex flex-col">
      <VerticalTimeline lineColor="rgba(145, 94, 255, .18)">
        {experiences.map((experience, index) => (
          <ExperienceCard key={`experience-${index}`} experience={experience} />
        ))}
      </VerticalTimeline>
    </div>
  </>
);

export default SectionWrapper(Experience, "experience");
