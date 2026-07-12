import { departmentScores } from "../data/mockData";

export function deptTotal(row, weights) {
  return (
    (row.environmental * weights.environmental +
      row.social * weights.social +
      row.governance * weights.governance) /
    100
  );
}

export function overallScores(weights) {
  const n = departmentScores.length;
  const environmental = departmentScores.reduce((s, r) => s + r.environmental, 0) / n;
  const social = departmentScores.reduce((s, r) => s + r.social, 0) / n;
  const governance = departmentScores.reduce((s, r) => s + r.governance, 0) / n;
  const overall = (environmental * weights.environmental + social * weights.social + governance * weights.governance) / 100;
  return {
    environmental: round1(environmental),
    social: round1(social),
    governance: round1(governance),
    overall: round1(overall),
  };
}

export function round1(n) {
  return Math.round(n * 10) / 10;
}

export function isOverdue(dueDate, status) {
  if (status === "Resolved" || status === "Approved" || status === "Acknowledged") return false;
  return new Date(dueDate) < new Date("2026-07-12");
}
