export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-sig border border-ink-900/[0.06] bg-white shadow-panel ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 font-mono text-xs uppercase tracking-wider text-ink-600">{eyebrow}</p>}
        <h2 className="text-xl font-semibold text-ink-900">{title}</h2>
      </div>
      {action}
    </div>
  );
}

const PILL_STYLES = {
  moss: "bg-moss-500/10 text-moss-700 border-moss-500/20",
  amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  violet: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  coral: "bg-coral-500/10 text-coral-600 border-coral-500/20",
  neutral: "bg-ink-900/5 text-ink-700 border-ink-900/10",
};

export function Pill({ tone = "neutral", children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium ${PILL_STYLES[tone] ?? PILL_STYLES.neutral} ${className}`}>
      {children}
    </span>
  );
}

export function statusTone(status) {
  const map = {
    Active: "moss",
    Approved: "moss",
    Acknowledged: "moss",
    Completed: "moss",
    Resolved: "moss",
    Pending: "amber",
    Open: "coral",
    "In Progress": "indigo",
    Scheduled: "indigo",
    Draft: "neutral",
    "Under Review": "violet",
    Archived: "neutral",
    "Out of Stock": "coral",
  };
  return map[status] ?? "neutral";
}

export function ProgressBar({ pct, tone = "moss" }) {
  const bg = {
    moss: "bg-moss-500",
    amber: "bg-amber-500",
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    coral: "bg-coral-500",
  }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/[0.07]">
      <div className={`h-full rounded-full ${bg}`} style={{ width: `${Math.min(100, pct)}%`, transition: "width 0.5s ease" }} />
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-ink-900 text-paper-50 hover:bg-ink-800",
    moss: "bg-moss-600 text-white hover:bg-moss-700",
    outline: "border border-ink-900/15 text-ink-900 hover:bg-ink-900/5",
    ghost: "text-ink-700 hover:bg-ink-900/5",
    danger: "bg-coral-600 text-white hover:bg-coral-700",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-rise" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-sig bg-white p-6 shadow-panel animate-rise">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-ink-600 hover:bg-ink-900/5" aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto scrollbar-thin pr-1">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      {Icon && <Icon className="h-8 w-8 text-ink-600/40" strokeWidth={1.5} />}
      <p className="font-medium text-ink-800">{title}</p>
      {hint && <p className="max-w-xs text-sm text-ink-600">{hint}</p>}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-ink-900/15 bg-paper-50 px-3 py-2 text-sm text-ink-900 outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500";
