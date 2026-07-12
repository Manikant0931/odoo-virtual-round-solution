import { useState } from "react";
import { Plus, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useEsg } from "../context/EsgContext";
import { policies, audits, employees } from "../data/mockData";
import { isOverdue } from "../utils/scoring";
import { Card, SectionHeading, Pill, Button, statusTone, Modal, Field, inputCls, ProgressBar } from "../components/ui";

const empName = (id) => employees.find((e) => e.id === id)?.name ?? id;
const policyName = (id) => policies.find((p) => p.id === id)?.title ?? id;

export default function Governance() {
  const { state, resolveComplianceIssue, acknowledgePolicy, addComplianceIssue } = useEsg();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", audit: audits[0].id, severity: "Medium", owner: employees[0].id, due: "2026-07-25" });

  function submit(e) {
    e.preventDefault();
    if (!form.title) return;
    addComplianceIssue(form);
    setOpen(false);
    setForm({ title: "", audit: audits[0].id, severity: "Medium", owner: employees[0].id, due: "2026-07-25" });
  }

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-indigo-600">Governance</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900 lg:text-3xl">Policies, Audits &amp; Compliance</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-700">Track policy acknowledgement, audit programs, and every compliance issue through to resolution.</p>
      </div>

      <Card className="p-6">
        <SectionHeading eyebrow="Policies" title="ESG Policy Library" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {policies.map((p) => (
            <div key={p.id} className="rounded-xl border border-ink-900/[0.06] p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-ink-900">{p.title}</p>
                <Pill tone="indigo">{p.version}</Pill>
              </div>
              <p className="mt-1 font-mono text-[11px] text-ink-600">Effective {p.effective}</p>
              <div className="mt-3 flex items-center justify-between font-mono text-xs text-ink-700">
                <span>{p.acknowledgedPct}% acknowledged</span>
              </div>
              <div className="mt-1.5"><ProgressBar pct={p.acknowledgedPct} tone="indigo" /></div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeading eyebrow="Acknowledgements" title="Pending Policy Sign-off" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/[0.08] text-xs uppercase tracking-wide text-ink-600">
                <th className="py-2 pr-3 font-medium">Employee</th>
                <th className="py-2 pr-3 font-medium">Policy</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.policyAcknowledgements.map((pa) => (
                <tr key={pa.id} className="border-b border-ink-900/[0.04] last:border-0">
                  <td className="py-2.5 pr-3 text-ink-900">{empName(pa.employee)}</td>
                  <td className="py-2.5 pr-3 text-ink-700">{policyName(pa.policy)}</td>
                  <td className="py-2.5 pr-3"><Pill tone={statusTone(pa.status)}>{pa.status}</Pill></td>
                  <td className="py-2.5 text-right">
                    {pa.status === "Pending" ? (
                      <Button variant="outline" onClick={() => acknowledgePolicy(pa.id)} className="!py-1 !px-3 text-xs">
                        <CheckCircle2 size={13} /> Acknowledge
                      </Button>
                    ) : (
                      <span className="font-mono text-xs text-ink-500">{pa.acknowledgedOn}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeading eyebrow="Audits" title="Audit Program" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {audits.map((a) => (
            <div key={a.id} className="rounded-xl border border-ink-900/[0.06] p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600">
                <ShieldCheck size={16} />
              </div>
              <p className="text-sm font-medium text-ink-900">{a.title}</p>
              <p className="mt-1 font-mono text-[11px] text-ink-600">{a.dept} · {a.date}</p>
              <div className="mt-3 flex items-center justify-between">
                <Pill tone={statusTone(a.status)}>{a.status}</Pill>
                <span className="font-mono text-xs text-ink-600">{a.findings} findings</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeading
          eyebrow="Compliance"
          title="Compliance Issues"
          action={
            <Button variant="moss" onClick={() => setOpen(true)}>
              <Plus size={15} /> Raise Issue
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/[0.08] text-xs uppercase tracking-wide text-ink-600">
                <th className="py-2 pr-3 font-medium">Issue</th>
                <th className="py-2 pr-3 font-medium">Severity</th>
                <th className="py-2 pr-3 font-medium">Owner</th>
                <th className="py-2 pr-3 font-medium">Due</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.complianceIssues.map((c) => {
                const overdue = isOverdue(c.due, c.status);
                return (
                  <tr key={c.id} className="border-b border-ink-900/[0.04] last:border-0">
                    <td className="py-2.5 pr-3 text-ink-900">{c.title}</td>
                    <td className="py-2.5 pr-3"><Pill tone={c.severity === "High" ? "coral" : c.severity === "Medium" ? "amber" : "neutral"}>{c.severity}</Pill></td>
                    <td className="py-2.5 pr-3 text-ink-700">{empName(c.owner)}</td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-ink-700">{c.due}</td>
                    <td className="py-2.5 pr-3">
                      <Pill tone={overdue ? "coral" : statusTone(c.status)}>{overdue ? "Overdue" : c.status}</Pill>
                    </td>
                    <td className="py-2.5 text-right">
                      {c.status === "Open" ? (
                        <Button variant="outline" onClick={() => resolveComplianceIssue(c.id)} className="!py-1 !px-3 text-xs">
                          Mark resolved
                        </Button>
                      ) : (
                        <span className="font-mono text-xs text-ink-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Raise Compliance Issue" footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="moss" onClick={submit}>Raise Issue</Button>
        </>
      }>
        <form onSubmit={submit}>
          <Field label="Issue title">
            <input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Missing supplier declaration" />
          </Field>
          <Field label="Linked audit">
            <select className={inputCls} value={form.audit} onChange={(e) => setForm({ ...form, audit: e.target.value })}>
              {audits.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </Field>
          <Field label="Severity">
            <select className={inputCls} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
              {["Low", "Medium", "High"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Owner">
            <select className={inputCls} value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </Field>
          <Field label="Due date">
            <input type="date" required className={inputCls} value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </Field>
          <p className="font-mono text-xs text-ink-600">Every issue requires an owner and due date. Issues open past due will be flagged automatically.</p>
        </form>
      </Modal>
    </div>
  );
}
