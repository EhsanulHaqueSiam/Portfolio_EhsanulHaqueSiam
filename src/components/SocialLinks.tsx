import { m } from 'framer-motion';
import { profile } from '../data/content';
import { MagneticHover } from './ui/ImageDistortion';
import { GitHubIcon, LinkedInIcon, ResumeIcon } from './ui/Icons';

export function SocialLinks() {
  return (
    <m.div
      className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-[100]"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1.4 }}
    >
      <MagneticHover strength={30}>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="w-12 h-12 rounded-full border border-white/10 bg-space-900/80 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300"
        >
          <GitHubIcon />
        </a>
      </MagneticHover>
      <MagneticHover strength={30}>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="w-12 h-12 rounded-full border border-white/10 bg-space-900/80 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300"
        >
          <LinkedInIcon />
        </a>
      </MagneticHover>
      <MagneticHover strength={30}>
        <a
          href="#resume"
          aria-label="Resume"
          className="group relative w-12 h-12 rounded-full border border-white/10 bg-space-900/80 flex items-center justify-center text-gray-400 hover:text-white hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300"
        >
          <span className="absolute inset-0 rounded-full border border-amber-500/0 group-hover:border-amber-500/30 group-hover:scale-125 transition-all duration-500" />
          <ResumeIcon />
        </a>
      </MagneticHover>
      <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent mx-auto mt-2" />
    </m.div>
  );
}
