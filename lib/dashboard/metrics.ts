export type DashboardMetrics = {
  generatedAt: Date;
  income: { current: number; previous: number; changePercent: number | null };
  members: { active: number; inactive: number; overdue: number; total: number };
  memberships: { active: number; paused: number; cancelled: number; total: number };
  attendance: { today: number; inside: number };
  plans: Array<{ id: string; name: string; count: number; percentage: number }>;
};

export function calculatePercentage(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 1000) / 10;
}

export function calculateChange(current: number, previous: number) {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
