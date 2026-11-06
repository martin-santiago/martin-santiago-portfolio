export const ONBOARDING_STEPS = [
  { id: "welcome", selector: "#portfolio-hero" },
  { id: "allocation", selector: "#allocation-chart" },
  { id: "calculation", selector: "#calculation-walkthrough" },
  { id: "orders", selector: "#orders-plan" },
  { id: "drift", selector: "#positions-table tbody tr:first-child" },
  { id: "advice", selector: "#advice-request" },
  { id: "target", selector: "#edit-target" },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];
