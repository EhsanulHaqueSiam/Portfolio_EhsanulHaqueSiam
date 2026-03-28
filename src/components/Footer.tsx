import { m } from 'framer-motion';
import { profile } from '../data/content';
import { GitHubIcon, LinkedInIcon, EmailIcon } from './ui/Icons';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and copyright */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <a
              href="#main-content"
              aria-label="Go to top"
              className="inline-flex items-center min-h-[44px] text-xl font-display font-bold gradient-text mb-2"
            >
              Siam
            </a>
            <p className="text-gray-500 text-sm">
              © {currentYear} {profile.name}. All rights reserved.
            </p>
          </m.div>

          {/* Quick links */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-6"
          >
            <a
              href="#about"
              className="press-feedback inline-flex items-center min-h-[44px] px-1 text-gray-500 hover:text-violet-400 text-sm"
            >
              About
            </a>
            <a
              href="#projects"
              className="press-feedback inline-flex items-center min-h-[44px] px-1 text-gray-500 hover:text-violet-400 text-sm"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="press-feedback inline-flex items-center min-h-[44px] px-1 text-gray-500 hover:text-violet-400 text-sm"
            >
              Contact
            </a>
          </m.div>

          {/* Social links */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <a
              href={profile.github}
              target="_blank"
              rel="me noopener noreferrer"
              className="press-feedback w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-space-800/50 flex items-center justify-center text-gray-500 hover:text-violet-400 hover:bg-space-700/50"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="me noopener noreferrer"
              className="press-feedback w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-space-800/50 flex items-center justify-center text-gray-500 hover:text-violet-400 hover:bg-space-700/50"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="press-feedback w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-space-800/50 flex items-center justify-center text-gray-500 hover:text-violet-400 hover:bg-space-700/50"
              aria-label="Email"
            >
              <EmailIcon />
            </a>
          </m.div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-xs font-mono">
            {'<'} Built with React, TypeScript & Tailwind {'/>'}
          </p>
        </div>
      </div>
    </footer>
  );
}
