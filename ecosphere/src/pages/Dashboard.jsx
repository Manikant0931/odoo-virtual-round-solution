import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from "recharts";
import { Flame, Users2, ShieldAlert, Trophy } from "lucide-react";
import { useEsg } from "../context/EsgContext";
import { departmentScores, carbonTrend, complianceIssues as seedIssues } from "../data/mockData";
import { overallScores, deptTotal, isOverdue } from "../utils/scoring";
import ScoreRing from "../components/ScoreRing";
import { Card, SectionHeading, Pill, statusTone } from "../components/ui";

export default function Dashboard() {
  const { state } = useEsg();
  const scores = overallScores(state.settings.weights);
  const openIssues = state.complianceIssues.filter((c) => c.status === "Open");
  const overdueCount = openIssues.filter((c) => isOverdue(c.due, c.status)).length;
  const totalEmissions = state.carbonTransactions.reduce((s, t) => s + t.emissions, 0);
  const pendingApprovals =
    state.employeeParticipation.filter((p) => p.status === "Pending").length +
    state.challengeParticipation.filter((p) => p.approval === "Pending").length;

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-moss-600">Organization Overview</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900 lg:text-3xl">ESG Performance Dashboard</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-700">
          Live snapshot of environmental, social and governance performance across all departments, weighted{" "}
          {state.settings.weights.environmental}/{state.settings.weights.social}/{state.settings.weights.governance}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-ink-600">Overall ESG Score</p>
          <ScoreRing {...scores} />
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <Kpi icon={Flame} tone="moss" label="Total Emissions Logged" value={`${(totalEmissions / 1000).toFixed(1)}t`} sub="CO₂e across 6 transactions" />
          <Kpi icon={Users2} tone="coral" label="Pending Approvals" value={pendingApprovals} sub="CSR + challenge submissions" />
          <Kpi icon={ShieldAlert} tone="indigo" label="Open Compliance Issues" value={openIssues.length} sub={`${overdueCount} overdue`} warn={overdueCount > 0} />
          <Kpi icon={Trophy} tone="violet" label="Active Challenges" value={state.challenges.filter((c) => c.status === "Active").length} sub={`${state.challenges.filter((c) => c.status === "Completed").length} completed`} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <SectionHeading eyebrow="Environmental" title="Carbon Emissions Trend" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={carbonTrend} margin={{ left: -20, top: 6 }}>
              <defs>
                <linearGradient id="emissionFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5C8A6C" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#5C8A6C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#E1E5DB" />
              <XAxis dataKey="month" tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: "#2C3F32" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: "#2C3F32" }} axisLine={false} tickLine={false} width={48} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #E1E5DB", fontFamily: "IBM Plex Sans", fontSize: 13 }}
                formatter={(v) => [`${v.toLocaleString()} kg CO₂e`, "Emissions"]}
              />
              <Area type="monotone" dataKey="emissions" stroke="#3F6B4C" strokeWidth={2} fill="url(#emissionFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <SectionHeading eyebrow="Governance" title="Compliance Watch" />
          <div className="space-y-3">
            {openIssues.slice(0, 4).map((issue) => (
              <div key={issue.id} className="flex items-start justify-between gap-3 rounded-xl border border-ink-900/[0.06] p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">{issue.title}</p>
                  <p className="font-mono text-[11px] text-ink-600">Due {issue.due}</p>
                </div>
                <Pill tone={isOverdue(issue.due, issue.status) ? "coral" : "amber"}>
                  {isOverdue(issue.due, issue.status) ? "Overdue" : issue.severity}
                </Pill>
              </div>
            ))}
            {openIssues.length === 0 && <p className="py-8 text-center text-sm text-ink-600">No open issues. Governance is clear.</p>}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <SectionHeading eyebrow="Department Ranking" title="ESG Score by Department" />
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={departmentScores} margin={{ left: -20, top: 6 }}>
            <CartesianGrid vertical={false} stroke="#E1E5DB" />
            <XAxis dataKey="dept" tick={{ fontFamily: "IBM Plex Mono", fontSize: 10.5, fill: "#2C3F32" }} axisLine={false} tickLine={false} interval={0} angle={-12} dy={12} height={50} />
            <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: "#2C3F32" }} axisLine={false} tickLine={false} width={36} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E1E5DB", fontFamily: "IBM Plex Sans", fontSize: 13 }} />
            <Legend wrapperStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5 }} />
            <Bar dataKey="environmental" name="Environmental" fill="#5C8A6C" radius={[5, 5, 0, 0]} />
            <Bar dataKey="social" name="Social" fill="#D06B58" radius={[5, 5, 0, 0]} />
            <Bar dataKey="governance" name="Governance" fill="#5A6FC0" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function Kpi({ icon: Icon, tone, label, value, sub, warn }) {
  const toneMap = {
    moss: "bg-moss-500/10 text-moss-600",
    coral: "bg-coral-500/10 text-coral-600",
    indigo: "bg-indigo-500/10 text-indigo-600",
    violet: "bg-violet-500/10 text-violet-600",
  };
  return (
    <Card className="p-5">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full ${toneMap[tone]}`}>
        <Icon size={17} strokeWidth={2} />
      </div>
      <p className="font-mono text-2xl font-semibold text-ink-900">{value}</p>
      <p className="mt-0.5 text-sm text-ink-700">{label}</p>
      <p className={`mt-1 font-mono text-[11px] ${warn ? "text-coral-600" : "text-ink-600"}`}>{sub}</p>
    </Card>
  );
}
