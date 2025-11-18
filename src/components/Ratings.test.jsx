// Ratings.test.jsx
import { render, screen } from "@testing-library/react";
import Ratings from "./Ratings";

describe("Ratings Component", () => {

  test("renders 5 stars always", () => {
    render(<Ratings rating={3} />);
    const stars = screen.getByTestId("ratings").querySelectorAll("svg, div");
    expect(stars.length).toBe(5);
  });

  test("renders correct number of full stars for integer rating", () => {
    render(<Ratings rating={4} />);
    const fullStars = document.querySelectorAll("svg.text-yellow-400.w-6.h-6");
    expect(fullStars.length).toBeGreaterThanOrEqual(4);
  });

  test("renders empty stars when rating is 0", () => {
    render(<Ratings rating={0} />);
    const emptyStars = document.querySelectorAll("svg.text-yellow-400.w-6.h-6");
    expect(emptyStars.length).toBe(5);
  });

  test("renders partial star for fractional rating", () => {
    render(<Ratings rating={3.5} />);
    const partialContainer = document.querySelector(
      "div.relative.w-6.h-6 > div[style]"
    );

    expect(partialContainer).toBeInTheDocument();
    expect(parseFloat(partialContainer.style.width)).toBeCloseTo(50, 1);
  });

  test("renders correct structure for fractional (e.g., 4.3)", () => {
    render(<Ratings rating={4.3} />);

    const partialContainer = document.querySelector(
      "div.relative.w-6.h-6 > div[style]"
    );

    expect(partialContainer).toBeInTheDocument();

    // Use floating-point tolerant comparison
    const widthPercent = parseFloat(partialContainer.style.width);

    expect(widthPercent).toBeCloseTo(30, 1); // <-- fixed!
  });

});
