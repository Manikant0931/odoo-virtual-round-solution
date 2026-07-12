import { useState } from "react";
import { useEsg } from "../context/EsgContext";
import { departments, categories } from "../data/mockData";
import { Card, SectionHeading, Pill } from "../components/ui";

export default function Settings() {
  const { state, toggleSetting, setWeights } = useEsg();
  const [w, setW] = useState(state.settings.weights);

  function commitWeights(next) {
    setW(next);
    const sum = next.environmental + next.social + next.governance;
    if (sum === 100) setWeights(next);
  }

  const sum = w.environmental + w.social + w.governance;

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-ink-600">Settings &amp; Administration</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900 lg:text-3xl">Configuration</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-700">Toggle automated business rules, tune ESG score weighting, and manage master data.</p>
      </div>

      <Card className="p-6">
        <SectionHeading eyebrow="Automation" title="Business Rule Toggles" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <ToggleRow
            label="Auto Emission Calculation"
            hint="Carbon transactions are calculated automatically from Purchase, Manufacturing, Expense or Fleet records."
            checked={state.settings.autoEmissionCalculation}
            onChange={() => toggleSetting("autoEmissionCalculation")}
          />
          <ToggleRow
            label="Evidence Requirement"
            hint="A CSR activity or challenge submission cannot be approved without an attached proof file."
            checked={state.settings.evidenceRequirement}
            onChange={() => toggleSetting("evidenceRequirement")}
          />
          <ToggleRow
            label="Badge Auto-Award"
            hint="Badges are assigned automatically the moment an employee's XP or activity count meets the unlock rule."
            checked={state.settings.badgeAutoAward}
            onChange={() => toggleSetting("badgeAutoAward")}
          />
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeading eyebrow="ESG Configuration" title="Overall Score Weighting" />
        <p className="mb-4 text-sm text-ink-700">Adjust how much each pillar contributes to the Overall ESG Score. Must total 100%.</p>
        <div className="space-y-5">
          <WeightSlider label="Environmental" tone="moss" value={w.environmental} onChange={(v) => commitWeights({ ...w, environmental: v })} />
          <WeightSlider label="Social" tone="coral" value={w.social} onChange={(v) => commitWeights({ ...w, social: v })} />
          <WeightSlider label="Governance" tone="indigo" value={w.governance} onChange={(v) => commitWeights({ ...w, governance: v })} />
        </div>
        <div className="mt-4">
          <Pill tone={sum === 100 ? "moss" : "coral"}>{sum}% total {sum !== 100 && "— must equal 100% to apply"}</Pill>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <SectionHeading eyebrow="Master Data" title="Departments" />
          <div className="space-y-2">
            {departments.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-ink-900/[0.06] px-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-ink-900">{d.name}</p>
                  <p className="font-mono text-[11px] text-ink-600">{d.code} · {d.employees} employees · Head: {d.head}</p>
                </div>
                <Pill tone="moss">{d.status}</Pill>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeading eyebrow="Master Data" title="Categories" />
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-ink-900/[0.06] px-3 py-2 text-sm">
                <p className="font-medium text-ink-900">{c.name}</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-ink-600">{c.type}</span>
                  <Pill tone="moss">{c.status}</Pill>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <SectionHeading eyebrow="Notifications" title="Notification Settings" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            "New compliance issue raised",
            "CSR / Challenge approval decisions",
            "Policy acknowledgement reminders",
            "Badge unlocks",
          ].map((n) => (
            <div key={n} className="flex items-center justify-between rounded-lg border border-ink-900/[0.06] px-3 py-2.5 text-sm">
              <span className="text-ink-800">{n}</span>
              <MiniToggle defaultOn />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <div className="rounded-xl border border-ink-900/[0.06] p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink-900">{label}</p>
        <Toggle checked={checked} onChange={onChange} />
      </div>
      <p className="text-xs text-ink-600">{hint}</p>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-moss-600" : "bg-ink-900/15"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function MiniToggle({ defaultOn }) {
  const [on, setOn] = useState(!!defaultOn);
  return <Toggle checked={on} onChange={() => setOn((v) => !v)} />;
}

function WeightSlider({ label, tone, value, onChange }) {
  const toneMap = { moss: "accent-moss-600", coral: "accent-coral-600", indigo: "accent-indigo-600" };
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-ink-900">{label}</span>
        <span className="font-mono text-ink-700">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${toneMap[tone]}`}
      />
    </div>
  );
}
