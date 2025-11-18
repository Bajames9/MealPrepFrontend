// ScrollPane.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import ScrollPane from "./ScrollPane";

describe("ScrollPane Component", () => {
  const makeChildren = (count) =>
    Array.from({ length: count }, (_, i) => (
      <div key={i} data-testid="child">
        Item {i + 1}
      </div>
    ));

  test("renders title and navigation buttons", () => {
    render(<ScrollPane title="My Title">{makeChildren(3)}</ScrollPane>);

    expect(screen.getByText("My Title")).toBeInTheDocument();

    // Expect exactly 2 navigation buttons
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);
  });

  test("calculates container width based on number of children", () => {
    render(<ScrollPane title="Test">{makeChildren(3)}</ScrollPane>);

    const contentContainer = screen.getByTestId("scroll-content");
    expect(contentContainer.style.width).toBe("1200px");
  });

  test("scrolls right when right button pressed", () => {
    render(<ScrollPane title="Scroll Test">{makeChildren(5)}</ScrollPane>);

    const contentContainer = screen.getByTestId("scroll-content");
    const rightButton = screen.getAllByRole("button")[1];

    fireEvent.click(rightButton);

    expect(contentContainer.style.transform).toBe("translateX(-700px)");
  });

  test("scrolls left only after scrolling right first", () => {
    render(<ScrollPane title="Scroll Test">{makeChildren(5)}</ScrollPane>);

    const contentContainer = screen.getByTestId("scroll-content");
    const [leftButton, rightButton] = screen.getAllByRole("button");

    // Initially cannot scroll left
    fireEvent.click(leftButton);
    expect(contentContainer.style.transform).toBe("translateX(100px)");

    // Scroll right
    fireEvent.click(rightButton);
    expect(contentContainer.style.transform).toBe("translateX(-700px)");

    // Scroll left (back to +100)
    fireEvent.click(leftButton);
    expect(contentContainer.style.transform).toBe("translateX(100px)");
  });

  test("does not scroll beyond total width limit (correct behavior)", () => {
    render(<ScrollPane title="Boundary">{makeChildren(2)}</ScrollPane>);

    const contentContainer = screen.getByTestId("scroll-content");
    const rightButton = screen.getAllByRole("button")[1];

    fireEvent.click(rightButton);

    // For 2 children, ScrollPane WILL scroll right once.
    expect(contentContainer.style.transform).toBe("translateX(-700px)");
  });
});
