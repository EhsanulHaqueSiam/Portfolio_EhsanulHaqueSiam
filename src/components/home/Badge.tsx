import { m, useTransform } from 'framer-motion';
import { experience, profile, profileImage } from '../../data/content';
import { haptic } from '../../lib/haptics';
import { usePull } from '../../lib/pull';
import { sound } from '../../lib/sound';

/** Current roles, "Role, Company", without the parenthetical speciality. */
const nowRoles = experience.filter((e) => /present/i.test(e.date)).map((e) => `${e.role.replace(/\s*\(.*\)$/, '')}, ${e.company}`);
const [city, country] = profile.location.split(',').map((s) => s.trim());

// Rope length from the anchor to the badge's clip, in px.
const ROPE = 22;

/**
 * An ID badge on a lanyard that hangs from the top of the closing section (after Sam Cheng's
 * site). Drag it anywhere; on release a soft, underdamped spring swings it back to rest, so it
 * sways a few times and stops. It moves only while held or settling. The rope is one SVG
 * path redrawn from the badge's position. Decorative, so it is hidden from screen readers.
 */
export function Badge() {
  const { x, y, handlers } = usePull({
    follow: 1,
    stiffness: 130,
    damping: 7,
    onGrab: (e) => {
      sound.click();
      if (e.pointerType !== 'mouse') haptic('selection');
    },
    onRelease: () => sound.note(4),
  });
  // Swinging right tilts it left, like a card pivoting on its clip.
  const rotate = useTransform(x, [-200, 0, 200], [22, 0, -22]);
  const rope = useTransform([x, y], ([dx, dy]: number[]) => `M0 0 Q${dx * 0.45} ${(ROPE + dy) / 2 + 6} ${dx} ${ROPE + dy}`);

  return (
    <div aria-hidden="true" data-playful="" className="pointer-events-none absolute left-1/2 top-0 sm:left-[calc(100%-84px)] print:hidden">
      <svg aria-hidden="true" className="absolute left-0 top-0 overflow-visible" width="1" height="1">
        <m.path d={rope} className="fill-none stroke-border" strokeWidth={5} strokeLinecap="round" />
      </svg>
      <m.div
        {...handlers}
        style={{ x, y, rotate, top: ROPE }}
        // Centred on the anchor by offset, not translate: framer owns this element's transform.
        className="pointer-events-auto absolute left-[-62px] w-[124px] origin-top cursor-grab touch-none select-none active:cursor-grabbing"
      >
        <div className="relative rounded-xl border border-black/10 bg-[#f4f4f1] px-2.5 pb-2.5 pt-3.5 text-[#0a0a0a] shadow-[0_10px_24px_rgb(0_0_0/0.35)]">
          <span className="absolute -top-2 left-1/2 h-3.5 w-6 -translate-x-1/2 rounded-[4px] border-2 border-[#71717a] bg-[#a1a1aa]" />
          <span className="mx-auto mb-2 block h-1 w-7 rounded-full bg-[#d4d4d8]" />
          <img src={profileImage} alt="" width={104} height={104} loading="lazy" draggable={false} className="pointer-events-none aspect-square w-full rounded-lg object-cover" />
          <p className="mt-2 font-serif text-[17px] leading-[1.05]">{profile.name}</p>
          {nowRoles.map((r) => (
            <p key={r} className="mt-1 text-[10px] leading-snug text-[#3f3f46]">
              {r}
            </p>
          ))}
          <p className="mt-2 flex justify-between border-t border-dashed border-[#d4d4d8] pt-1.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#71717a]">
            <span>{city}</span>
            <span>{country}</span>
          </p>
        </div>
      </m.div>
    </div>
  );
}
