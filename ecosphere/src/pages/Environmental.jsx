import { useState } from "react";
import { Plus, Zap } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useEsg } from "../context/EsgContext";
import { emissionFactors, environmentalGoals, departments } from "../data/mockData";
import { Card, SectionHeading, Pill, ProgressBar, Button, Modal, Field, inputCls, EmptyState } from "../components/ui";

const deptName = (id) => departments.find((d) => d.id === id)?.name ?? id;
const factorName = (id) => emissionFactors.find((f) => f.id === id)?.activity ?? id;
const COLORS = ["#5C8A6C", "#7FA98A", "#2E5038", "#3F6B4C", "#A9C4B2"];

export default function Environmental() {
  const { state, addCarbonTransaction } = useEsg();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ dept: departments[0].id, source: "Purchase", factorId: emissionFactors[0].id, quantity: "" });

  const byDept = departments.map((d) => ({
    name: d.code,
    value: state.carbonTransactions.filter((t) => t.dept === d.id).reduce((s, t) => s + t.emissions, 0),
  })).filter((d) => d.value > 0);

  function submit(e) {
    e.preventDefault();
    if (!form.quantity) return;
    addCarbonTransaction({ ...form, quantity: Number(form.quantity), auto: false });
    setOpen(false);
    setForm({ dept: departments[0].id, source: "Purchase", factorId: emissionFactors[0].id, quantity: "" });
  }

  return (
    <div className="space-y-6 animate-rise">
      <Header />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <SectionHeading eyebrow="Environmental" title="Carbon by Department" />
          {byDept.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={byDept} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {byDept.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v.toLocaleString()} kg CO₂e`} contentStyle={{ borderRadius: 12, border: "1px solid #E1E5DB", fontFamily: "IBM Plex Sans", fontSize: 13 }} />
                <Legend wrapperStyle={{ fontFamily: "IBM Plex Mono", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No transactions yet" />
          )}
        </Card>

        <Card className="p-6 lg:col-span-3">
          <SectionHeading
            eyebrow="Configuration"
            title="Emission Factors"
            action={
              <Pill tone={state.settings.autoEmissionCalculation ? "moss" : "neutral"}>
                <Zap size={12} /> Auto-calc {state.settings.autoEmissionCalculation ? "on" : "off"}
              </Pill>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/[0.08] text-xs uppercase tracking-wide text-ink-600">
                  <th className="py-2 pr-3 font-medium">Activity</th>
                  <th className="py-2 pr-3 font-medium">Scope</th>
                  <th className="py-2 font-medium text-right">Factor</th>
                </tr>
              </thead>
              <tbody>
                {emissionFactors.map((f) => (
                  <tr key={f.id} className="border-b border-ink-900/[0.04] last:border-0">
                    <td className="py-2.5 pr-3 text-ink-900">{f.activity}</td>
                    <td className="py-2.5 pr-3"><Pill tone="moss">{f.scope}</Pill></td>
                    <td className="py-2.5 text-right font-mono text-ink-700">{f.factor} <span className="text-ink-500">{f.unit.split("/")[0].trim() ? "" : ""}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <SectionHeading
          eyebrow="Goals"
          title="Sustainability Goals"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {environmentalGoals.map((g) => (
            <div key={g.id} className="rounded-xl border border-ink-900/[0.06] p-4">
              <p className="text-sm font-medium text-ink-900">{g.title}</p>
              <p className="mt-0.5 font-mono text-[11px] text-ink-600">{g.dept} · due {g.due}</p>
              <div className="mt-3 flex items-center justify-between font-mono text-xs text-ink-700">
                <span>{g.progress}% of {g.target}{g.unit}</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar pct={g.progress} tone="moss" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeading
          eyebrow="Ledger"
          title="Carbon Transactions"
          action={
            <Button variant="moss" onClick={() => setOpen(true)}>
              <Plus size={15} /> Log Transaction
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/[0.08] text-xs uppercase tracking-wide text-ink-600">
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Department</th>
                <th className="py-2 pr-3 font-medium">Source</th>
                <th className="py-2 pr-3 font-medium">Factor</th>
                <th className="py-2 pr-3 font-medium text-right">Quantity</th>
                <th className="py-2 font-medium text-right">Emissions (kg CO₂e)</th>
              </tr>
            </thead>
            <tbody>
              {state.carbonTransactions.map((t) => (
                <tr key={t.id} className="border-b border-ink-900/[0.04] last:border-0">
                  <td className="py-2.5 pr-3 font-mono text-xs text-ink-700">{t.date}</td>
                  <td className="py-2.5 pr-3 text-ink-900">{deptName(t.dept)}</td>
                  <td className="py-2.5 pr-3">
                    <Pill tone={t.auto ? "moss" : "neutral"}>{t.source}</Pill>
                  </td>
                  <td className="py-2.5 pr-3 text-ink-700">{factorName(t.factorId)}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-ink-700">{t.quantity.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-mono font-semibold text-ink-900">{t.emissions.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Log Carbon Transaction" footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="moss" onClick={submit}>Save Transaction</Button>
        </>
      }>
        <form onSubmit={submit}>
          <Field label="Department">
            <select className={inputCls} value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Source">
            <select className={inputCls} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              {["Purchase", "Manufacturing", "Expense", "Fleet", "Manual Entry"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Emission Factor">
            <select className={inputCls} value={form.factorId} onChange={(e) => setForm({ ...form, factorId: e.target.value })}>
              {emissionFactors.map((f) => (
                <option key={f.id} value={f.id}>{f.activity} ({f.unit})</option>
              ))}
            </select>
          </Field>
          <Field label="Quantity">
            <input type="number" min="0" required className={inputCls} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 500" />
          </Field>
          <p className="font-mono text-xs text-ink-600">Emissions will be auto-calculated as quantity × emission factor.</p>
        </form>
      </Modal>
    </div>
  );
}

function Header() {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-moss-600">Environmental</p>
      <h1 className="mt-1 text-2xl font-semibold text-ink-900 lg:text-3xl">Carbon &amp; Sustainability</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-700">Emission factors, department carbon tracking, and progress against sustainability goals.</p>
    </div>
  );
}
