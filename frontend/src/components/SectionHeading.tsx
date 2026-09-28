interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-2xl mb-14 ${alignClass}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-emerald mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-4">{title}</h2>
      {description && <p className="text-muted text-base md:text-lg leading-relaxed">{description}</p>}
    </div>
  );
}
