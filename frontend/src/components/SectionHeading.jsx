export default function SectionHeading({ eyebrow, title, description, action }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 className="section-title mt-2 text-3xl md:text-4xl">{title}</h2>{description && <p className="muted mt-3 max-w-xl text-sm leading-6">{description}</p>}</div>{action}</div>;
}
