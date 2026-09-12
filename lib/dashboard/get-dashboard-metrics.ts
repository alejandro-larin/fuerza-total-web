import { prisma } from "@/lib/prisma";
import { getServerEnv } from "@/lib/env";
import { requireOwner } from "@/lib/auth/require-owner";
import { getDashboardDateRanges } from "@/lib/dashboard/date-ranges";
import {
  calculateChange,
  calculatePercentage,
  type DashboardMetrics,
} from "@/lib/dashboard/metrics";

export async function getDashboardMetrics(now = new Date()): Promise<DashboardMetrics> {
  await requireOwner();
  const ranges = getDashboardDateRanges(now, getServerEnv().GYM_TIME_ZONE);

  const [currentIncome, previousIncome, members, memberships, attendance, inside, plans] =
    await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paidAt: { gte: ranges.monthStart, lt: ranges.monthEnd } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paidAt: { gte: ranges.previousMonthStart, lt: ranges.monthStart } },
      }),
      prisma.member.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.membership.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.checkIn.count({ where: { enteredAt: { gte: ranges.dayStart, lt: ranges.dayEnd } } }),
      prisma.checkIn.count({
        where: { enteredAt: { gte: ranges.dayStart, lt: ranges.dayEnd }, leftAt: null },
      }),
      prisma.plan.findMany({
        select: { id: true, name: true, _count: { select: { members: true } } },
        orderBy: { name: "asc" },
      }),
    ]);

  const memberCounts = Object.fromEntries(members.map((row) => [row.status, row._count._all]));
  const membershipCounts = Object.fromEntries(
    memberships.map((row) => [row.status, row._count._all]),
  );
  const totalWithPlan = plans.reduce((sum, plan) => sum + plan._count.members, 0);
  const current = Number(currentIncome._sum.amount ?? 0);
  const previous = Number(previousIncome._sum.amount ?? 0);
  const active = memberCounts.ACTIVE ?? 0;
  const inactive = memberCounts.INACTIVE ?? 0;
  const overdue = memberCounts.OVERDUE ?? 0;
  const activeMemberships = membershipCounts.ACTIVE ?? 0;
  const pausedMemberships = membershipCounts.PAUSED ?? 0;
  const cancelledMemberships = membershipCounts.CANCELLED ?? 0;

  return {
    generatedAt: now,
    income: { current, previous, changePercent: calculateChange(current, previous) },
    members: { active, inactive, overdue, total: active + inactive + overdue },
    memberships: {
      active: activeMemberships,
      paused: pausedMemberships,
      cancelled: cancelledMemberships,
      total: activeMemberships + pausedMemberships + cancelledMemberships,
    },
    attendance: { today: attendance, inside },
    plans: plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      count: plan._count.members,
      percentage: calculatePercentage(plan._count.members, totalWithPlan),
    })),
  };
}
