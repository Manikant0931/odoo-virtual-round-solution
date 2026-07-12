import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { Check, X, FileWarning, CalendarDays } from "lucide-react";
import { useEsg } from "../context/EsgContext";
import { csrActivities, diversityMetrics, employees } from "../data/mockData";
import { Card, SectionHeading, Pill, Button, statusTone, ProgressBar } from "../components/ui";

const empName = (id) => employees.find((e) => e.id === id)?.name ?? id;
const GENDER_COLORS = ["#D06B58", "#5A6FC0", "#E3A855"];

export default function Social() {
  const { state, approveParticipation, registerCsr } = useEsg();
  const authUserId = state.auth?.userId;

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-coral-600">Social</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900 lg:text-3xl">CSR &amp; Employee Engagement</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-700">Organize community initiatives, review participation proof, and track diversity &amp; training metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {csrActivities.map((a) => {
          const myReg = authUserId && state.employeeParticipation.some((p) => p.activity === a.id && p.employee === authUserId);
          const full = a.registered >= a.capacity;
          return (
            <Card key={a.id} className="p-5">
              <Pill tone="coral">{a.category}</Pill>
              <p className="mt-3 text-sm font-semibold text-ink-900">{a.title}</p>
              <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-ink-600">
                <CalendarDays size={12} /> {a.date}
              </p>
              <div className="mt-3">
                <div className="mb-1 flex justify-between font-mono text-[11px] text-ink-600">
                  <span>{a.registered}/{a.capacity} registered</span>
                  {a.evidenceRequired && <span className="flex items-center gap-1"><FileWarning size={11} /> proof required</span>}
                </div>
                <ProgressBar pct={(a.registered / a.capacity) * 100} tone="coral" />
              </div>
              <Button
                variant={myReg ? "outline" : "moss"}
                className="mt-4 w-full"
                disabled={myReg || full || !authUserId}
                onClick={() => registerCsr(a.id, authUserId)}
              >
                {myReg ? "You're registered" : full ? "Full" : "Register interest"}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <SectionHeading eyebrow="Approvals" title="Employee Participation" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/[0.08] text-xs uppercase tracking-wide text-ink-600">
                <th className="py-2 pr-3 font-medium">Employee</th>
                <th className="py-2 pr-3 font-medium">Activity</th>
                <th className="py-2 pr-3 font-medium">Proof</th>
                <th className="py-2 pr-3 font-medium">Points</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.employeeParticipation.map((p) => {
                const activity = csrActivities.find((a) => a.id === p.activity);
                const blocked = state.settings.evidenceRequirement && activity?.evidenceRequired && !p.proof;
                return (
                  <tr key={p.id} className="border-b border-ink-900/[0.04] last:border-0">
                    <td className="py-2.5 pr-3 text-ink-900">{empName(p.employee)}</td>
                    <td className="py-2.5 pr-3 text-ink-700">{activity?.title}</td>
                    <td className="py-2.5 pr-3">
                      {p.proof ? <Pill tone="moss">attached</Pill> : <Pill tone={blocked ? "coral" : "neutral"}>none</Pill>}
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-ink-700">{p.points}</td>
                    <td className="py-2.5 pr-3"><Pill tone={statusTone(p.status)}>{p.status}</Pill></td>
                    <td className="py-2.5 text-right">
                      {p.status === "Pending" ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            title={blocked ? "Evidence required before approval" : "Approve"}
                            disabled={blocked}
                            onClick={() => approveParticipation(p.id, "Approved")}
                            className="rounded-full bg-moss-500/10 p-1.5 text-moss-700 hover:bg-moss-500/20 disabled:opacity-30"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => approveParticipation(p.id, "Rejected")}
                            className="rounded-full bg-coral-500/10 p-1.5 text-coral-600 hover:bg-coral-500/20"
                          >
                            <X size={15} />
                          </button>
                        </div>
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <SectionHeading eyebrow="Diversity" title="Workforce Composition" />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={diversityMetrics.genderSplit} dataKey="value" nameKey="label" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {diversityMetrics.genderSplit.map((_, i) => (
                  <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: "1px solid #E1E5DB", fontFamily: "IBM Plex Sans", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontFamily: "IBM Plex Mono", fontSize: 11.5 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-3 text-center font-mono text-xs">
            <div className="rounded-lg bg-ink-900/[0.03] py-2">
              <p className="text-lg font-semibold text-ink-900">{diversityMetrics.leadershipWomenPct}%</p>
              <p className="text-ink-600">Women in leadership</p>
            </div>
            <div className="rounded-lg bg-ink-900/[0.03] py-2">
              <p className="text-lg font-semibold text-ink-900">{diversityMetrics.newHiresWomenPct}%</p>
              <p className="text-ink-600">Women, new hires</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-3">
          <SectionHeading eyebrow="Training" title="Training Completion by Department" />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={diversityMetrics.trainingByDept} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid horizontal={false} stroke="#E1E5DB" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: "#2C3F32" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dept" width={130} tick={{ fontFamily: "IBM Plex Sans", fontSize: 12, fill: "#16221B" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: "1px solid #E1E5DB", fontFamily: "IBM Plex Sans", fontSize: 13 }} />
              <Bar dataKey="completion" fill="#D06B58" radius={[0, 5, 5, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
