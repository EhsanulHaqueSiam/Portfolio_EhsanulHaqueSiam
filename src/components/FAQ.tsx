import { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { faqItems } from '../data/content';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { QuestionIcon, PlusIcon } from './ui/Icons';
import { BlurFade } from './ui/BlurFade';

function FaqRow({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card/60 backdrop-blur-sm transition-colors duration-300 hover:border-ring/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
      >
        <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
          {question}
        </span>
        <PlusIcon
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-5">
              {answer}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * FAQ accordion. Content mirrors the JSON-LD FAQPage in seo/schema.ts,
 * which Google requires to match on-page text.
 */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-28">
      <SectionHeading icon={<QuestionIcon className={headingIconClass} />}>FAQ</SectionHeading>
      <div className="mx-auto max-w-3xl space-y-3">
        {faqItems.map((item, i) => (
          <BlurFade key={item.question} delay={0.05 + i * 0.04} inView>
            <FaqRow
              question={item.question}
              answer={item.answer}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
