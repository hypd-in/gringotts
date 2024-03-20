import { mountSuspended } from "@nuxt/test-utils/runtime";
import { it, expect, describe } from "vitest";

import PDPButtons from "../components/ProductComponents/PDPButtons.vue";

describe("PDP buttons", () => {
  it("can mount some component", async () => {
    const component = await mountSuspended(PDPButtons);
    expect(component).toBeTruthy();
  });
});
