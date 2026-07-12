import { useState } from "react";
import { Check, X, Footprints, Leaf, HeartHandshake, Trophy, Gift, Crown } from "lucide-react";
import { useEsg } from "../context/EsgContext";
import { badges, employees, departments } from "../data/mockData";
import { Card, SectionHeading, Pill, Button, statusTone, ProgressBar } from "../components/ui";

const empName = (id) => employees.find((e) => e.id === id)?.name ?? id;
const deptName = (id) => departments.find((d) => d.id === id)?.name ?? "";

const BADGE_ICONS = { Footprints, Leaf, HeartHandshake, Trophy };

const LIFECYCLE = ["Draft", "Active", "Under Review", "Completed", "Archived"];

export default function Gamification() {
  const { state, setChallengeStatus, approveChallenge, joinChallenge, redeemReward } = useEsg();
  const [tab, setTab] = useState("challenges");
  const authUserId = state.auth?.userId;
  const currentUser = state.employees.find((e) => e.id === authUserId) ?? null;

  const leaderboard = [...state.employees].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-violet-600">Gamification</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900 lg:text-3xl">Challenges, Badges &amp; Rewards</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-700">Keep employees engaged with sustainability challenges, auto-awarded badges, and a redeemable rewards catalog.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {[
          ["challenges", "Challenges"],
          ["badges", "Badges"],
          ["rewards", "Rewards"],
          ["leaderboard", "Leaderboard"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === key ? "bg-ink-900 text-white" : "bg-white text-ink-700 hover:bg-ink-900/5 border border-ink-900/[0.06]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "challenges" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {state.challenges.map((c) => {
              const joined = authUserId && state.challengeParticipation.some((p) => p.challenge === c.id && p.employee === authUserId);
              return (
                <Card key={c.id} className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <Pill tone={c.category === "Environment" ? "moss" : c.category === "Social" ? "coral" : "indigo"}>{c.category}</Pill>
                    <Pill tone={statusTone(c.status)}>{c.status}</Pill>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink-900">{c.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-700">{c.description}</p>
                  <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-ink-600">
                    <span>{c.xp} XP</span>
                    <span>·</span>
                    <span>{c.difficulty}</span>
                    <span>·</span>
                    <span>due {c.deadline}</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {c.status === "Active" && (
                      <Button variant={joined ? "outline" : "moss"} disabled={joined || !authUserId} onClick={() => joinChallenge(c.id, authUserId)} className="flex-1 !py-1.5 text-xs">
                        {joined ? "Joined" : "Join challenge"}
                      </Button>
                    )}
                    <select
                      value={c.status}
                      onChange={(e) => setChallengeStatus(c.id, e.target.value)}
                      className="rounded-full border border-ink-900/15 bg-paper-50 px-2.5 py-1.5 font-mono text-[11px] text-ink-700 outline-none"
                      aria-label={`Change lifecycle status for ${c.title}`}
                    >
                      {LIFECYCLE.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="p-6">
            <SectionHeading eyebrow="Approvals" title="Challenge Submissions" />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-900/[0.08] text-xs uppercase tracking-wide text-ink-600">
                    <th className="py-2 pr-3 font-medium">Employee</th>
                    <th className="py-2 pr-3 font-medium">Challenge</th>
                    <th className="py-2 pr-3 font-medium">Progress</th>
                    <th className="py-2 pr-3 font-medium">Proof</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.challengeParticipation.map((p) => {
                    const challenge = state.challenges.find((c) => c.id === p.challenge);
                    const blocked = state.settings.evidenceRequirement && challenge?.evidenceRequired && !p.proof;
                    return (
                      <tr key={p.id} className="border-b border-ink-900/[0.04] last:border-0">
                        <td className="py-2.5 pr-3 text-ink-900">{empName(p.employee)}</td>
                        <td className="py-2.5 pr-3 text-ink-700">{challenge?.title}</td>
                        <td className="py-2.5 pr-3 w-32"><ProgressBar pct={p.progress} tone="violet" /></td>
                        <td className="py-2.5 pr-3">{p.proof ? <Pill tone="moss">attached</Pill> : <Pill tone={blocked ? "coral" : "neutral"}>none</Pill>}</td>
                        <td className="py-2.5 pr-3"><Pill tone={statusTone(p.approval)}>{p.approval}</Pill></td>
                        <td className="py-2.5 text-right">
                          {p.approval === "Pending" ? (
                            <div className="flex justify-end gap-1.5">
                              <button disabled={blocked} onClick={() => approveChallenge(p.id, "Approved")} className="rounded-full bg-moss-500/10 p-1.5 text-moss-700 hover:bg-moss-500/20 disabled:opacity-30">
                                <Check size={15} />
                              </button>
                              <button onClick={() => approveChallenge(p.id, "Rejected")} className="rounded-full bg-coral-500/10 p-1.5 text-coral-600 hover:bg-coral-500/20">
                                <X size={15} />
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono text-xs text-ink-500">+{p.xpAwarded} XP</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab === "badges" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => {
            const Icon = BADGE_ICONS[b.icon] ?? Trophy;
            const holders = state.employees.filter((e) => e.badges.includes(b.id));
            return (
              <Card key={b.id} className="p-5 text-center">
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-${b.color}-500/10 text-${b.color}-600`}>
                  <Icon size={24} />
                </div>
                <p className="mt-3 text-sm font-semibold text-ink-900">{b.name}</p>
                <p className="mt-1 text-xs text-ink-700">{b.description}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-ink-500">{b.unlockRule}</p>
                <p className="mt-3 font-mono text-xs text-ink-600">{holders.length} earned</p>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "rewards" && (
        <div>
          <div className="mb-4 flex items-center justify-between rounded-xl bg-violet-500/10 px-4 py-3">
            <p className="text-sm text-violet-700">Redeeming as <strong>{currentUser?.name ?? "Your account"}</strong></p>
            <p className="font-mono text-sm font-semibold text-violet-700">{currentUser ? `${currentUser.points} points available` : "Sign in to redeem"}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {state.rewards.map((r) => {
              const you = currentUser;
              const canRedeem = r.stock > 0 && you && you.points >= r.pointsRequired;
              return (
                <Card key={r.id} className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                    <Gift size={20} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink-900">{r.name}</p>
                  <p className="mt-1 font-mono text-xs text-ink-600">{r.pointsRequired} pts · {r.stock} in stock</p>
                  <Button variant={canRedeem ? "moss" : "outline"} disabled={!canRedeem} className="mt-3 w-full !py-1.5 text-xs" onClick={() => redeemReward(r.id, authUserId)}>
                    {r.stock <= 0 ? "Out of stock" : !you ? "Sign in to redeem" : you.points < r.pointsRequired ? "Not enough points" : "Redeem"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {tab === "leaderboard" && (
        <Card className="p-6">
          <SectionHeading eyebrow="Rankings" title="XP Leaderboard" />
          <div className="space-y-2">
            {leaderboard.map((e, i) => (
              <div key={e.id} className={`flex items-center gap-3 rounded-xl p-3 ${i === 0 ? "bg-amber-500/10" : "hover:bg-ink-900/[0.03]"}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold ${i === 0 ? "bg-amber-500 text-white" : "bg-ink-900/[0.06] text-ink-700"}`}>
                  {i === 0 ? <Crown size={14} /> : i + 1}
                </div>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-${e.avatarColor}-500 font-display text-xs font-semibold text-white`}>
                  {e.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{e.name}</p>
                  <p className="font-mono text-[11px] text-ink-600">{deptName(e.dept)}</p>
                </div>
                <div className="flex gap-1">
                  {e.badges.slice(0, 3).map((bid) => {
                    const b = badges.find((x) => x.id === bid);
                    const Icon = BADGE_ICONS[b?.icon] ?? Trophy;
                    return (
                      <div key={bid} className={`flex h-6 w-6 items-center justify-center rounded-full bg-${b?.color}-500/10 text-${b?.color}-600`} title={b?.name}>
                        <Icon size={12} />
                      </div>
                    );
                  })}
                </div>
                <p className="w-20 text-right font-mono text-sm font-semibold text-ink-900">{e.xp} XP</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
