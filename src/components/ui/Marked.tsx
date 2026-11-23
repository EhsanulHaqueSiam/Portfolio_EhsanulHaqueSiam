/** Renders hq text with `**x**` marks as <strong>; hq marks the one number each CV bullet bolds. */
export function Marked({ text }: { text: string }) {
  return <>{text.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))}</>;
}
