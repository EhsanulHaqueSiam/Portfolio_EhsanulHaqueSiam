import { useState, useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { profile } from '../data/content';
import { SplitText } from './ui/SplitText';
import { MagneticHover } from './ui/ImageDistortion';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      // Clear any existing timeout before setting a new one
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-violet-500/50" />
            <span className="text-violet-500 font-mono text-sm">08</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-500/50" />
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6">
            <SplitText animation="blur" stagger={0.03}>
              Get In Touch
            </SplitText>
          </h2>
          <m.p
            className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            I'm always interested in hearing about new opportunities, collaborations,
            or just having a chat about AI and software development.
          </m.p>
        </div>

        {/* Email card */}
        <m.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-6 sm:p-8 md:p-12 rounded-3xl bg-space-800/50 border border-white/5 text-center">
            <p className="text-gray-500 text-sm font-mono mb-4">// reach_me_at</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <m.a
                href={`mailto:${profile.email}`}
                className="text-lg sm:text-2xl md:text-4xl font-display font-bold text-white hover:text-violet-400 transition-colors break-all sm:break-normal"
                whileHover={{ scale: 1.02 }}
              >
                {profile.email}
              </m.a>
              <m.button
                onClick={copyEmail}
                className="relative p-3 min-w-[48px] min-h-[48px] rounded-xl bg-space-700/50 text-gray-400 hover:text-white hover:bg-violet-500/20 transition-all flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Copy email"
              >
                {copied ? (
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
                {/* Tooltip */}
                <m.span
                  className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg whitespace-nowrap"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : 5 }}
                >
                  Copied!
                </m.span>
              </m.button>
            </div>
          </div>
        </m.div>

        {/* CTA button */}
        <m.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MagneticHover strength={25}>
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full font-display font-semibold text-white text-xl hover:shadow-lg hover:shadow-violet-500/25 transition-shadow"
            >
              <span>Say Hello</span>
              <m.span
                className="text-3xl"
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: 'easeInOut',
                }}
              >
                👋
              </m.span>
            </a>
          </MagneticHover>
        </m.div>

        {/* Social links */}
        <m.div
          className="flex justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            {
              href: profile.github,
              label: 'GitHub',
              icon: (
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              ),
            },
            {
              href: profile.linkedin,
              label: 'LinkedIn',
              icon: (
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              ),
            },
          ].map((social) => (
            <MagneticHover key={social.label} strength={20}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-violet-500/50 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  {social.icon}
                </svg>
                <span className="font-medium">{social.label}</span>
              </a>
            </MagneticHover>
          ))}
        </m.div>
      </div>
    </section>
  );
}
