import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlanDistribution } from "./plan-distribution";

describe("PlanDistribution", () => {
  it("renders an honest empty state", () => {
    render(<PlanDistribution plans={[]} />);
    expect(screen.getByText("Aún no hay socios asociados a un plan.")).toBeInTheDocument();
  });

  it("exposes quantities and percentages as text", () => {
    render(
      <PlanDistribution
        plans={[{ id: "total", name: "Total", count: 3, percentage: 60 }]}
      />,
    );
    expect(screen.getByText("3 socios · 60%")).toBeInTheDocument();
  });
});
