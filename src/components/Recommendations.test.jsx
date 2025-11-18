// Recommendations.test.jsx
import { render, screen } from "@testing-library/react";
import Recommendations from "./Recommendations";
import { vi } from "vitest";

// ---- Mock ScrollPane ----
vi.mock("./ScrollPane.jsx", () => ({
  default: ({ title, children }) => (
    <div data-testid="scroll-pane">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  ),
}));

// ---- Mock useHomeData ----
const mockUseHomeData = vi.fn();

vi.mock("../hooks/getRecomendations.js", () => ({
  useHomeData: () => mockUseHomeData(),
}));

describe("Recommendations Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders Favorites section when favoriteCards exist", () => {
    mockUseHomeData.mockReturnValue({
      favoriteCards: <div>FavCard</div>,
      recommendationsLoading: false,
      recommendationCards: null,
    });

    render(<Recommendations />);

    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("FavCard")).toBeInTheDocument();
  });

  test("renders loading skeleton when recommendationsLoading is true", () => {
    mockUseHomeData.mockReturnValue({
      favoriteCards: null,
      recommendationsLoading: true,
    });

    render(<Recommendations />);

    expect(screen.getByText("Recommendations")).toBeInTheDocument();

    // Should display 4 skeleton cards
    const skeletons = screen.getAllByRole("generic");
    expect(skeletons.length).toBeGreaterThanOrEqual(4);
  });

  test("renders Recommendations ScrollPane when data is loaded", () => {
    mockUseHomeData.mockReturnValue({
      recommendationsLoading: false,
      recommendationCards: <div>Rec1</div>,
    });

    render(<Recommendations />);

    expect(screen.getByText("Recommendations")).toBeInTheDocument();
    expect(screen.getByText("Rec1")).toBeInTheDocument();
  });

  test("renders all category sections when data exists", () => {
    mockUseHomeData.mockReturnValue({
      favoriteCards: null,
      recommendationsLoading: false,
      recommendationCards: null,

      category1Name: "Breakfast",
      category1Cards: <div>Eggs</div>,

      category2Name: "Lunch",
      category2Cards: <div>Sandwich</div>,

      category3Name: "Dinner",
      category3Cards: <div>Steak</div>,

      category4Name: "Snacks",
      category4Cards: <div>Chips</div>,

      category5Name: "Dessert",
      category5Cards: <div>Cake</div>,
    });

    render(<Recommendations />);

    expect(screen.getByText("Breakfast")).toBeInTheDocument();
    expect(screen.getByText("Eggs")).toBeInTheDocument();

    expect(screen.getByText("Lunch")).toBeInTheDocument();
    expect(screen.getByText("Sandwich")).toBeInTheDocument();

    expect(screen.getByText("Dinner")).toBeInTheDocument();
    expect(screen.getByText("Steak")).toBeInTheDocument();

    expect(screen.getByText("Snacks")).toBeInTheDocument();
    expect(screen.getByText("Chips")).toBeInTheDocument();

    expect(screen.getByText("Dessert")).toBeInTheDocument();
    expect(screen.getByText("Cake")).toBeInTheDocument();
  });

});
