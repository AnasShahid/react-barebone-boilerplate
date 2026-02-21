import { render, screen } from "@testing-library/react";
import { PricingCard } from "../../components/pricing-card";
import { describe, it, expect } from "@jest/globals";

describe("PricingCard", () => {
  const mockPlan = {
    id: "1",
    name: "Basic Plan",
    price: 10,
    features: [
      {
        name: "AI Text Generation",
        included: true,
        limit: "1,000 words/month",
      },
      { name: "Image Analysis", included: true, limit: "50 images/month" },
      { name: "API Access", included: false },
    ],
    highlighted: false,
    description: "Best for professionals and small teams",
    billingPeriod: "monthly",
  };

  it("renders pricing card with correct information", () => {
    render(<PricingCard plan={mockPlan} />);

    expect(screen.getByText(mockPlan.name)).toBeInTheDocument();
    expect(screen.getByText(mockPlan.price)).toBeInTheDocument();
    mockPlan.features.forEach((feature) => {
      expect(screen.getByText(feature.name)).toBeInTheDocument();
    });
  });

  it("highlights recommended plan", () => {
    const recommendedPlan = { ...mockPlan, highlighted: true };
    render(<PricingCard plan={recommendedPlan} />);

    expect(screen.getByText("Recommended")).toBeInTheDocument();
  });

  it("renders subscribe button", () => {
    render(<PricingCard plan={mockPlan} />);

    const subscribeButton = screen.getByRole("button", { name: /subscribe/i });
    expect(subscribeButton).toBeInTheDocument();
  });
});
