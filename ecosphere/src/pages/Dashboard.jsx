import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from "recharts";
import { Flame, Users2, ShieldAlert, Trophy } from "lucide-react";
import { useEsg } from "../context/EsgContext";
import { departmentScores, carbonTrend } from "../data/mockData";
import { overallScores, isOverdue } from "../utils/scoring";
import ScoreRing from "../components/ScoreRing";
import { Card, SectionHeading, Pill } from "../components/ui";

const ESG_THEME = {
  environmental: "#356B4E",
  environmentalSoft: "#BFD8C6",
  social: "#C55E4A",
  socialSoft: "#F0C2B8",
  governance: "#4F63B8",
  governanceSoft: "#C7D0F4",
  ink: "#132016",
};

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
        <p className="font-mono text-xs uppercase tracking-wider text-moss-700">Organization Overview</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-950 lg:text-3xl">ESG Performance Dashboard</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-700">
          Live snapshot of environmental, social and governance performance across all departments, weighted {state.settings.weights.environmental}/{state.settings.weights.social}/{state.settings.weights.governance}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          className="p-6 lg:col-span-1"
          style={{
            background: "linear-gradient(135deg, #f3f9f4 0%, #fcfbf8 52%, #f2f6fb 100%)",
            borderColor: "rgba(53, 107, 78, 0.16)",
          }}
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-moss-700">Overall ESG Score</p>
          <ScoreRing {...scores} />
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
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
                  <stop offset="0%" stopColor={ESG_THEME.environmental} stopOpacity={0.38} />
                  <stop offset="100%" stopColor={ESG_THEME.environmental} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#DCE5DA" />
              <XAxis dataKey="month" tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: ESG_THEME.ink }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: ESG_THEME.ink }} axisLine={false} tickLine={false} width={48} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #DCE5DA", fontFamily: "IBM Plex Sans", fontSize: 13, background: "#FBFCFA" }}
                formatter={(v) => [`${v.toLocaleString()} kg CO₂e`, "Emissions"]}
              />
              <Area type="monotone" dataKey="emissions" stroke={ESG_THEME.environmental} strokeWidth={2.5} fill="url(#emissionFill)" />
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
            <CartesianGrid vertical={false} stroke="#DCE5DA" />
            <XAxis dataKey="dept" tick={{ fontFamily: "IBM Plex Mono", fontSize: 10.5, fill: ESG_THEME.ink }} axisLine={false} tickLine={false} interval={0} angle={-12} dy={12} height={50} />
            <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: ESG_THEME.ink }} axisLine={false} tickLine={false} width={36} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #DCE5DA", fontFamily: "IBM Plex Sans", fontSize: 13, background: "#FBFCFA" }} />
            <Legend wrapperStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5 }} />
            <Bar dataKey="environmental" name="Environmental" fill={ESG_THEME.environmental} radius={[5, 5, 0, 0]} />
            <Bar dataKey="social" name="Social" fill={ESG_THEME.social} radius={[5, 5, 0, 0]} />
            <Bar dataKey="governance" name="Governance" fill={ESG_THEME.governance} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function Kpi({ icon: Icon, tone, label, value, sub, warn }) {
  const toneMap = {
    moss: "bg-moss-600/12 text-moss-700",
    coral: "bg-coral-600/12 text-coral-700",
    indigo: "bg-indigo-600/12 text-indigo-700",
    violet: "bg-violet-600/12 text-violet-700",
  };

  return (
    <Card className="p-5">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full ${toneMap[tone]}`}>
        <Icon size={17} strokeWidth={2} />
      </div>
      <p className="font-mono text-2xl font-semibold text-ink-950">{value}</p>
      <p className="mt-0.5 text-sm text-ink-700">{label}</p>
      <p className={`mt-1 font-mono text-[11px] ${warn ? "text-coral-700" : "text-ink-600"}`}>{sub}</p>
    </Card>
  );
}
