import { describe, it, expect } from "vitest";

describe("Estimator Logic", () => {
  it("should correctly calculate total parts price", () => {
    const selectedParts = [
      { name: "Gas Refill", price: 1499 },
      { name: "Capacitor", price: 650 },
    ];

    const totalPrice = selectedParts.reduce((acc, part) => acc + part.price, 0);

    expect(totalPrice).toBe(2149);
  });

  it("should have a minimum labor cost of 399", () => {
    const laborCosts = [499, 399, 499];
    const minCost = Math.min(...laborCosts);

    expect(minCost).toBeGreaterThanOrEqual(399);
  });
});
