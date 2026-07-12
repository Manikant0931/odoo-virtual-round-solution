import { createContext, useContext, useMemo, useReducer, useCallback } from "react";
import * as seed from "../data/mockData";

const EsgCtx = createContext(null);

function uid(prefix) {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}`;
}

const initialState = {
  employees: seed.employees,
  csrActivities: seed.csrActivities,
  employeeParticipation: seed.employeeParticipation,
  challenges: seed.challenges,
  challengeParticipation: seed.challengeParticipation,
  rewards: seed.rewards,
  redemptions: [],
  complianceIssues: seed.complianceIssues,
  policyAcknowledgements: seed.policyAcknowledgements,
  carbonTransactions: seed.carbonTransactions,
  notifications: seed.notificationsSeed,
  settings: {
    autoEmissionCalculation: true,
    evidenceRequirement: true,
    badgeAutoAward: true,
    weights: { ...seed.scoreWeights },
  },
};

function pushNotification(state, notif) {
  return [{ id: uid("n"), read: false, time: "just now", ...notif }, ...state.notifications];
}

function evaluateBadges(state, employeeId) {
  const emp = state.employees.find((e) => e.id === employeeId);
  if (!emp || !state.settings.badgeAutoAward) return state;

  const approvedCsr = state.employeeParticipation.filter((p) => p.employee === employeeId && p.status === "Approved").length;
  const approvedChallenges = state.challengeParticipation.filter((p) => p.employee === employeeId && p.approval === "Approved");
  const envChallengesCompleted = approvedChallenges.filter((p) => {
    const ch = state.challenges.find((c) => c.id === p.challenge);
    return ch && ch.category === "Environment";
  }).length;

  const unlocked = new Set(emp.badges);
  const newlyUnlocked = [];

  if ((approvedCsr > 0 || approvedChallenges.length > 0) && !unlocked.has("b1")) {
    unlocked.add("b1");
    newlyUnlocked.push("b1");
  }
  if (envChallengesCompleted >= 3 && !unlocked.has("b2")) {
    unlocked.add("b2");
    newlyUnlocked.push("b2");
  }
  if (emp.points >= 400 && !unlocked.has("b3")) {
    unlocked.add("b3");
    newlyUnlocked.push("b3");
  }
  if (emp.xp >= 1000 && !unlocked.has("b4")) {
    unlocked.add("b4");
    newlyUnlocked.push("b4");
  }

  if (newlyUnlocked.length === 0) return state;

  const employees = state.employees.map((e) =>
    e.id === employeeId ? { ...e, badges: Array.from(unlocked) } : e
  );

  let notifications = state.notifications;
  newlyUnlocked.forEach((bid) => {
    const badge = seed.badges.find((b) => b.id === bid);
    notifications = pushNotification({ ...state, notifications }, {
      type: "badge",
      text: `${emp.name} unlocked the badge ${badge?.name ?? bid}`,
    });
  });

  return { ...state, employees, notifications };
}

function reducer(state, action) {
  switch (action.type) {
    case "APPROVE_PARTICIPATION": {
      const { id, status } = action;
      const record = state.employeeParticipation.find((p) => p.id === id);
      if (!record) return state;
      if (state.settings.evidenceRequirement && status === "Approved" && !record.proof) {
        return pushNotifOnly(state, {
          type: "approval",
          text: `Cannot approve — evidence file required for this CSR participation.`,
        });
      }
      const employeeParticipation = state.employeeParticipation.map((p) =>
        p.id === id ? { ...p, status } : p
      );
      let employees = state.employees;
      if (status === "Approved") {
        employees = employees.map((e) =>
          e.id === record.employee ? { ...e, points: e.points + record.points, xp: e.xp + record.points } : e
        );
      }
      let next = { ...state, employeeParticipation, employees };
      next = {
        ...next,
        notifications: pushNotification(next, {
          type: "approval",
          text: `CSR participation ${status.toLowerCase()} for ${state.employees.find((e) => e.id === record.employee)?.name}`,
        }),
      };
      if (status === "Approved") next = evaluateBadges(next, record.employee);
      return next;
    }

    case "APPROVE_CHALLENGE": {
      const { id, approval } = action;
      const record = state.challengeParticipation.find((p) => p.id === id);
      if (!record) return state;
      const challenge = state.challenges.find((c) => c.id === record.challenge);
      if (state.settings.evidenceRequirement && challenge?.evidenceRequired && approval === "Approved" && !record.proof) {
        return pushNotifOnly(state, {
          type: "approval",
          text: `Cannot approve — evidence file required for "${challenge.title}".`,
        });
      }
      const xpAwarded = approval === "Approved" ? challenge?.xp ?? 0 : 0;
      const challengeParticipation = state.challengeParticipation.map((p) =>
        p.id === id ? { ...p, approval, xpAwarded } : p
      );
      let employees = state.employees;
      if (approval === "Approved") {
        employees = employees.map((e) =>
          e.id === record.employee ? { ...e, xp: e.xp + xpAwarded } : e
        );
      }
      let next = { ...state, challengeParticipation, employees };
      next = {
        ...next,
        notifications: pushNotification(next, {
          type: "approval",
          text: `Challenge "${challenge?.title}" ${approval.toLowerCase()} for ${state.employees.find((e) => e.id === record.employee)?.name}`,
        }),
      };
      if (approval === "Approved") next = evaluateBadges(next, record.employee);
      return next;
    }

    case "SET_CHALLENGE_STATUS": {
      const { id, status } = action;
      const challenges = state.challenges.map((c) => (c.id === id ? { ...c, status } : c));
      return { ...state, challenges };
    }

    case "REDEEM_REWARD": {
      const { rewardId, employeeId } = action;
      const reward = state.rewards.find((r) => r.id === rewardId);
      const employee = state.employees.find((e) => e.id === employeeId);
      if (!reward || !employee) return state;
      if (reward.stock <= 0 || employee.points < reward.pointsRequired) return state;
      const rewards = state.rewards.map((r) =>
        r.id === rewardId
          ? { ...r, stock: r.stock - 1, status: r.stock - 1 <= 0 ? "Out of Stock" : "Active" }
          : r
      );
      const employees = state.employees.map((e) =>
        e.id === employeeId ? { ...e, points: e.points - reward.pointsRequired } : e
      );
      const redemptions = [
        { id: uid("rd"), reward: rewardId, employee: employeeId, date: new Date().toISOString().slice(0, 10) },
        ...state.redemptions,
      ];
      let next = { ...state, rewards, employees, redemptions };
      next = {
        ...next,
        notifications: pushNotification(next, {
          type: "reward",
          text: `${employee.name} redeemed "${reward.name}" for ${reward.pointsRequired} points`,
        }),
      };
      return next;
    }

    case "ADD_COMPLIANCE_ISSUE": {
      const issue = { id: uid("ci"), status: "Open", ...action.issue };
      const complianceIssues = [issue, ...state.complianceIssues];
      let next = { ...state, complianceIssues };
      next = {
        ...next,
        notifications: pushNotification(next, {
          type: "compliance",
          text: `New compliance issue raised: ${issue.title}`,
        }),
      };
      return next;
    }

    case "RESOLVE_COMPLIANCE_ISSUE": {
      const complianceIssues = state.complianceIssues.map((c) =>
        c.id === action.id ? { ...c, status: "Resolved" } : c
      );
      return { ...state, complianceIssues };
    }

    case "ACKNOWLEDGE_POLICY": {
      const policyAcknowledgements = state.policyAcknowledgements.map((p) =>
        p.id === action.id
          ? { ...p, status: "Acknowledged", acknowledgedOn: new Date().toISOString().slice(0, 10) }
          : p
      );
      return { ...state, policyAcknowledgements };
    }

    case "ADD_CARBON_TRANSACTION": {
      const factor = seed.emissionFactors.find((f) => f.id === action.tx.factorId);
      const emissions = factor ? +(factor.factor * action.tx.quantity).toFixed(1) : 0;
      const tx = { id: uid("ct"), date: new Date().toISOString().slice(0, 10), emissions, ...action.tx };
      return { ...state, carbonTransactions: [tx, ...state.carbonTransactions] };
    }

    case "REGISTER_CSR": {
      const { activityId, employeeId } = action;
      const already = state.employeeParticipation.some(
        (p) => p.activity === activityId && p.employee === employeeId
      );
      if (already) return state;
      const csrActivities = state.csrActivities.map((a) =>
        a.id === activityId ? { ...a, registered: a.registered + 1 } : a
      );
      const activity = state.csrActivities.find((a) => a.id === activityId);
      const employeeParticipation = [
        { id: uid("ep"), employee: employeeId, activity: activityId, proof: null, status: "Pending", points: 30 },
        ...state.employeeParticipation,
      ];
      return { ...state, csrActivities, employeeParticipation };
    }

    case "JOIN_CHALLENGE": {
      const { challengeId, employeeId } = action;
      const already = state.challengeParticipation.some(
        (p) => p.challenge === challengeId && p.employee === employeeId
      );
      if (already) return state;
      const challengeParticipation = [
        { id: uid("cp"), challenge: challengeId, employee: employeeId, progress: 0, proof: null, approval: "Pending", xpAwarded: 0 },
        ...state.challengeParticipation,
      ];
      return { ...state, challengeParticipation };
    }

    case "TOGGLE_SETTING": {
      return { ...state, settings: { ...state.settings, [action.key]: !state.settings[action.key] } };
    }

    case "SET_WEIGHTS": {
      return { ...state, settings: { ...state.settings, weights: action.weights } };
    }

    case "MARK_NOTIFICATIONS_READ": {
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    }

    default:
      return state;
  }
}

function pushNotifOnly(state, notif) {
  return { ...state, notifications: pushNotification(state, notif) };
}

export function EsgProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      approveParticipation: (id, status) => dispatch({ type: "APPROVE_PARTICIPATION", id, status }),
      approveChallenge: (id, approval) => dispatch({ type: "APPROVE_CHALLENGE", id, approval }),
      setChallengeStatus: (id, status) => dispatch({ type: "SET_CHALLENGE_STATUS", id, status }),
      redeemReward: (rewardId, employeeId) => dispatch({ type: "REDEEM_REWARD", rewardId, employeeId }),
      addComplianceIssue: (issue) => dispatch({ type: "ADD_COMPLIANCE_ISSUE", issue }),
      resolveComplianceIssue: (id) => dispatch({ type: "RESOLVE_COMPLIANCE_ISSUE", id }),
      acknowledgePolicy: (id) => dispatch({ type: "ACKNOWLEDGE_POLICY", id }),
      addCarbonTransaction: (tx) => dispatch({ type: "ADD_CARBON_TRANSACTION", tx }),
      registerCsr: (activityId, employeeId) => dispatch({ type: "REGISTER_CSR", activityId, employeeId }),
      joinChallenge: (challengeId, employeeId) => dispatch({ type: "JOIN_CHALLENGE", challengeId, employeeId }),
      toggleSetting: (key) => dispatch({ type: "TOGGLE_SETTING", key }),
      setWeights: (weights) => dispatch({ type: "SET_WEIGHTS", weights }),
      markNotificationsRead: () => dispatch({ type: "MARK_NOTIFICATIONS_READ" }),
    }),
    []
  );

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);

  return <EsgCtx.Provider value={value}>{children}</EsgCtx.Provider>;
}

export function useEsg() {
  const ctx = useContext(EsgCtx);
  if (!ctx) throw new Error("useEsg must be used within EsgProvider");
  return ctx;
}
