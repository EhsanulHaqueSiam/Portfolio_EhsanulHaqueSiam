import { SplitText } from './SplitText';

interface SectionHeaderProps {
  number: string;
  title: string;
  className?: string;
}

export function SectionHeader({ number, title, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-10 sm:mb-16 md:mb-20 ${className}`}>
      <div className="flex items-center gap-4 mb-4 sm:mb-8">
        <span className="text-violet-500 font-mono text-xs sm:text-sm">{number}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent" />
      </div>
      <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold">
        <SplitText animation="blur" stagger={0.03}>
          {title}
        </SplitText>
      </h2>
    </div>
  );
}
