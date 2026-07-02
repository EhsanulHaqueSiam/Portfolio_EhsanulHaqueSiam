import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { BlurFade } from './ui/BlurFade';
import { SpotlightGlow } from './ui/SpotlightGlow';
import { SchoolIcon } from './ui/Icons';
import { hideImageOnError } from '../data/content';

interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  status: 'Pursuing' | 'Completed';
  image: string;
  highlights?: string[];
}

const records: EducationItem[] = [
  {
    institution: 'American International University-Bangladesh (AIUB)',
    degree: 'B.Sc. in Computer Science and Engineering',
    period: '2022 - 2026 (expected)',
    status: 'Pursuing',
    image: 'university',
    highlights: ["3x Dean's List", 'Term CGPA 3.95 / 3.89 / 3.75+', 'Published researcher'],
  },
  {
    institution: 'Govt. Azizul Haque College, Bogura',
    degree: 'Higher Secondary Certificate (HSC), Science',
    period: '2019 - 2021',
    status: 'Completed',
    image: 'college',
  },
  {
    institution: 'Bogra Zilla School',
    degree: 'Secondary School Certificate (SSC), Science',
    period: '2011 - 2019',
    status: 'Completed',
    image: 'school',
  },
];

function EducationCard({ item }: { item: EducationItem }) {
  return (
    <div className="group/glow relative overflow-hidden rounded-xl border bg-card/60 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-ring/60">
      <SpotlightGlow />
      <div className="flex flex-row space-x-3">
        <img
          src={`/images/education/${item.image}.webp`}
          width={40}
          height={40}
          alt=""
          loading="lazy"
          onError={hideImageOnError}
          className="mt-1 h-9 w-9 rounded-md object-cover sm:h-10 sm:w-10"
        />
        <div className="flex flex-col">
          <p className="text-balance text-sm font-bold leading-normal tracking-tight text-foreground sm:text-base">
            {item.degree}
          </p>
          <p className="mt-1 text-balance text-xs font-normal leading-snug tracking-tight text-muted-foreground md:text-sm">
            {item.institution}
            <span className="mx-1" aria-hidden="true">
              •
            </span>
            {item.period}
          </p>
        </div>
        <span
          className={`ml-auto mt-1 h-fit shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            item.status === 'Pursuing'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'bg-secondary text-muted-foreground'
          }`}
        >
          {item.status}
        </span>
      </div>
      {item.highlights && (
        <div className="mt-4 flex flex-row flex-wrap gap-2">
          {item.highlights.map((h) => (
            <span
              key={h}
              className="flex items-center justify-center rounded-sm bg-secondary px-2 py-1 text-xs font-semibold leading-none tracking-tight text-secondary-foreground md:text-sm"
            >
              {h}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Education: card ledger of academic records. */
export function Education() {
  return (
    <section id="education" className="scroll-mt-28">
      <SectionHeading icon={<SchoolIcon className={headingIconClass} />}>Education</SectionHeading>
      <div className="space-y-4">
        {records.map((item, i) => (
          <BlurFade key={item.institution} delay={0.1 + i * 0.05} direction="right" inView>
            <EducationCard item={item} />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
