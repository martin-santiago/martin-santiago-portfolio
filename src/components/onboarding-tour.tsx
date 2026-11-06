"use client";

import { type Driver, driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect, useRef } from "react";

import { ONBOARDING_STEPS } from "@/common/constants/onboarding";
import type { Dictionary } from "@/common/i18n/dictionaries";

type OnboardingTourProps = {
  copy: Dictionary["onboarding"];
};

function createTour(copy: Dictionary["onboarding"]): Driver {
  const tour: Driver = driver({
    showProgress: true,
    progressText: copy.progress,
    nextBtnText: copy.next,
    prevBtnText: copy.previous,
    doneBtnText: copy.done,
    showButtons: ["next", "previous"],
    popoverClass: "onboarding-popover",
    stageRadius: 0,
    stagePadding: 8,
    overlayOpacity: 0.55,
    steps: ONBOARDING_STEPS.map(({ id, selector }) => ({ element: selector, popover: copy.steps[id] })),
    onPopoverRender: (popover) => {
      const skipButton = document.createElement("button");
      skipButton.type = "button";
      skipButton.className = "onboarding-skip";
      skipButton.textContent = copy.skip;
      skipButton.addEventListener("click", () => tour.destroy());
      popover.footer.append(skipButton);
    },
  });
  return tour;
}

export function OnboardingTour({ copy }: OnboardingTourProps) {
  const tourRef = useRef<Driver | null>(null);
  const hasStartedRef = useRef(false);

  // The tour starts once per page load. Next re-runs this effect whenever it shows a kept page again (Activity),
  // so it only drives again if the tour was still open when the page was hidden.
  useEffect(() => {
    const tour = createTour(copy);
    tourRef.current = tour;
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      tour.drive();
    }
    return () => {
      if (tour.isActive()) hasStartedRef.current = false;
      tour.destroy();
    };
  }, [copy]);

  const handleRestart = () => tourRef.current?.drive();

  return (
    <button type="button" onClick={handleRestart} className="button-secondary">
      {copy.restart}
    </button>
  );
}
