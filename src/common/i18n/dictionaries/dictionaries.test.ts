import { describe, expect, it } from "vitest";

import { ONBOARDING_STEPS } from "../../constants/onboarding";
import { DICTIONARIES } from ".";

describe("dictionaries", () => {
  it.each(Object.entries(DICTIONARIES))("%s has copy for exactly the onboarding steps", (_, dictionary) => {
    expect(Object.keys(dictionary.onboarding.steps)).toEqual(ONBOARDING_STEPS.map(({ id }) => id));
  });
});
