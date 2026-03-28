import { useState, useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { profile } from '../data/content';
import { MagneticHover } from './ui/ImageDistortion';
import { GitHubIcon, LinkedInIcon } from './ui/Icons';
import { SplitText } from './ui/SplitText';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recruiterMailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent('Job Opportunity for Ehsanul Haque Siam')}&body=${encodeURIComponent('Hi Ehsanul,\n\nI found your portfolio and would like to discuss a role.\n\nRole Title:\nCompany:\nLocation:\nCompensation Range:\nInterview Process:\n\nBest regards,')}`;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const [copyFailed, setCopyFailed] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      // Fallback for older browsers or denied permissions
      try {
        const textarea = document.createElement('textarea');
        textarea.value = profile.email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setCopyFailed(false);
      } catch {
        setCopyFailed(true);
      }
    }
    // Clear any existing timeout before setting a new one
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => { setCopied(false); setCopyFailed(false); }, 2000);
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
            <span className="text-violet-500 font-mono text-sm">11</span>
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
                href={recruiterMailtoHref}
                className="press-feedback inline-flex items-center min-h-[44px] text-lg sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white hover:text-violet-400 break-all sm:break-normal"
                whileHover={{ scale: 1.02 }}
              >
                {profile.email}
              </m.a>
              <m.button
                onClick={copyEmail}
                className="relative p-3 min-w-[48px] min-h-[48px] rounded-xl bg-space-700/50 text-gray-400 hover:text-white hover:bg-violet-500/20 transition-[transform,color,background-color,border-color] duration-150 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
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
                  className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 text-xs rounded-lg whitespace-nowrap ${copyFailed ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: copied || copyFailed ? 1 : 0, y: copied || copyFailed ? 0 : 5 }}
                >
                  {copyFailed ? 'Failed to copy' : 'Copied!'}
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
          <div className="flex flex-wrap items-center justify-center gap-3">
            <MagneticHover strength={25}>
              <a
                href={recruiterMailtoHref}
                className="press-feedback group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full font-display font-semibold text-white text-lg sm:text-xl hover:shadow-lg hover:shadow-violet-500/25"
              >
                <span>Discuss a Role</span>
                <span className="text-3xl wave-hand">
                  👋
                </span>
              </a>
            </MagneticHover>
            <a
              href="/hire-me.html"
              className="press-feedback inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/20 text-gray-200 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 min-h-[44px]"
            >
              Hiring Snapshot
            </a>
          </div>
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
            { href: profile.github, label: 'GitHub', Icon: GitHubIcon },
            { href: profile.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="me noopener noreferrer"
              className="press-feedback flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-violet-500/50"
            >
              <social.Icon />
              <span className="font-medium">{social.label}</span>
            </a>
          ))}
        </m.div>
      </div>
    </section>
  );
}
