import { useMemo, useState } from "react";
import { Leaf, HeartHandshake, ShieldCheck, Gauge, Download, FileSpreadsheet, FileText } from "lucide-react";
import { useEsg } from "../context/EsgContext";
import { departments, employees, csrActivities, departmentScores } from "../data/mockData";
import { deptTotal } from "../utils/scoring";
import { Card, SectionHeading, Pill, Button, Field, inputCls, EmptyState } from "../components/ui";

const MODULES = ["Environmental", "Social", "Governance"];

function toCsv(rows, columns) {
  const header = columns.map((c) => c.label).join(",");
  const body = rows
    .map((r) => columns.map((c) => `"${String(c.value(r)).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

function download(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { state } = useEsg();
  const [module, setModule] = useState("Environmental");
  const [dept, setDept] = useState("all");
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-07-31");
  const [exported, setExported] = useState("");

  const rows = useMemo(() => buildRows(module, state, dept, from, to), [module, state, dept, from, to]);

  function exportCsv() {
    const csv = toCsv(rows.data, rows.columns);
    download(`ecosphere-${module.toLowerCase()}-report.csv`, csv);
    setExported("csv");
    setTimeout(() => setExported(""), 2200);
  }

  function exportOther(kind) {
    setExported(kind);
    setTimeout(() => setExported(""), 2200);
  }

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-ink-600">Reports</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900 lg:text-3xl">ESG Reporting Center</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-700">Generate module reports or build a custom report by combining filters, then export.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportCard icon={Leaf} tone="moss" title="Environmental Report" desc="Emissions, factors, goal progress" onClick={() => setModule("Environmental")} active={module === "Environmental"} />
        <ReportCard icon={HeartHandshake} tone="coral" title="Social Report" desc="CSR participation, diversity" onClick={() => setModule("Social")} active={module === "Social"} />
        <ReportCard icon={ShieldCheck} tone="indigo" title="Governance Report" desc="Policies, audits, compliance" onClick={() => setModule("Governance")} active={module === "Governance"} />
        <ReportCard icon={Gauge} tone="violet" title="ESG Summary Report" desc="Weighted score by department" onClick={() => setModule("Summary")} active={module === "Summary"} />
      </div>

      <Card className="p-6">
        <SectionHeading eyebrow="Custom Report Builder" title="Filter &amp; Export" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Module">
            <select className={inputCls} value={module} onChange={(e) => setModule(e.target.value)}>
              {[...MODULES, "Summary"].map((m) => <option key={m} value={m}>{m === "Summary" ? "ESG Summary" : m}</option>)}
            </select>
          </Field>
          <Field label="Department">
            <select className={inputCls} value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="all">All departments</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>
          <Field label="From">
            <input type="date" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label="To">
            <input type="date" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Button variant="moss" onClick={exportCsv}><Download size={14} /> Export CSV</Button>
          <Button variant="outline" onClick={() => exportOther("excel")}><FileSpreadsheet size={14} /> Export Excel</Button>
          <Button variant="outline" onClick={() => exportOther("pdf")}><FileText size={14} /> Export PDF</Button>
          {exported && (
            <Pill tone="moss" className="animate-rise">
              {exported === "csv" ? "CSV file downloaded" : `${exported.toUpperCase()} export queued`}
            </Pill>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-ink-900/[0.06]">
          {rows.data.length ? (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/[0.08] bg-ink-900/[0.02] text-xs uppercase tracking-wide text-ink-600">
                  {rows.columns.map((c) => (
                    <th key={c.label} className="py-2.5 px-3 font-medium">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.data.map((r, i) => (
                  <tr key={i} className="border-b border-ink-900/[0.04] last:border-0">
                    {rows.columns.map((c) => (
                      <td key={c.label} className="py-2.5 px-3 text-ink-800">{c.value(r)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="No rows match this filter" hint="Try widening the date range or department." />
          )}
        </div>
      </Card>
    </div>
  );
}

function ReportCard({ icon: Icon, tone, title, desc, onClick, active }) {
  const toneMap = {
    moss: "bg-moss-500/10 text-moss-600",
    coral: "bg-coral-500/10 text-coral-600",
    indigo: "bg-indigo-500/10 text-indigo-600",
    violet: "bg-violet-500/10 text-violet-600",
  };
  return (
    <button onClick={onClick} className={`text-left ${active ? "ring-2 ring-moss-500" : ""} rounded-sig`}>
      <Card className="p-5 h-full transition hover:shadow-lg">
        <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full ${toneMap[tone]}`}>
          <Icon size={17} />
        </div>
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        <p className="mt-1 text-xs text-ink-600">{desc}</p>
      </Card>
    </button>
  );
}

function buildRows(module, state, dept, from, to) {
  const inRange = (d) => d >= from && d <= to;
  const deptFilter = (id) => dept === "all" || id === dept;
  const deptName = (id) => departments.find((d) => d.id === id)?.name ?? id;

  if (module === "Environmental") {
    const data = state.carbonTransactions.filter((t) => deptFilter(t.dept) && inRange(t.date));
    return {
      data,
      columns: [
        { label: "Date", value: (r) => r.date },
        { label: "Department", value: (r) => deptName(r.dept) },
        { label: "Source", value: (r) => r.source },
        { label: "Quantity", value: (r) => r.quantity },
        { label: "Emissions (kg CO2e)", value: (r) => r.emissions },
      ],
    };
  }
  if (module === "Social") {
    const data = state.employeeParticipation.map((p) => ({
      ...p,
      empName: employees.find((e) => e.id === p.employee)?.name,
      activityTitle: csrActivities.find((a) => a.id === p.activity)?.title,
      activityDate: csrActivities.find((a) => a.id === p.activity)?.date,
    })).filter((r) => inRange(r.activityDate ?? "2026-01-01"));
    return {
      data,
      columns: [
        { label: "Employee", value: (r) => r.empName },
        { label: "Activity", value: (r) => r.activityTitle },
        { label: "Date", value: (r) => r.activityDate },
        { label: "Status", value: (r) => r.status },
        { label: "Points", value: (r) => r.points },
      ],
    };
  }
  if (module === "Governance") {
    const data = state.complianceIssues.filter((c) => inRange(c.due));
    return {
      data,
      columns: [
        { label: "Issue", value: (r) => r.title },
        { label: "Severity", value: (r) => r.severity },
        { label: "Owner", value: (r) => employees.find((e) => e.id === r.owner)?.name },
        { label: "Due", value: (r) => r.due },
        { label: "Status", value: (r) => r.status },
      ],
    };
  }
  // Summary
  const data = departmentScores
    .filter((r) => dept === "all" || departments.find((d) => d.id === dept)?.name === r.dept)
    .map((r) => ({ ...r, total: Math.round(deptTotal(r, state.settings.weights) * 10) / 10 }));
  return {
    data,
    columns: [
      { label: "Department", value: (r) => r.dept },
      { label: "Environmental", value: (r) => r.environmental },
      { label: "Social", value: (r) => r.social },
      { label: "Governance", value: (r) => r.governance },
      { label: "Total ESG Score", value: (r) => r.total },
    ],
  };
}
