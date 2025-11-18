// ListCard.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ListCard from "./ListCard";
import { MemoryRouter } from "react-router-dom";

// Mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  mockNavigate.mockClear();
});

describe("ListCard Component", () => {

  test("renders list title and recipe count", () => {
    render(
      <MemoryRouter>
        <ListCard
          listId={1}
          title="My Test List"
          recipeCount={3}
          isPublic={true}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("My Test List")).toBeInTheDocument();
    expect(screen.getByText("3 recipes")).toBeInTheDocument();
  });

  test("shows singular 'recipe' when count is 1", () => {
    render(
      <MemoryRouter>
        <ListCard
          listId={1}
          title="Single Item"
          recipeCount={1}
          isPublic={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("1 recipe")).toBeInTheDocument();
  });

  test("shows public icon when isPublic=true", () => {
    render(
      <MemoryRouter>
        <ListCard
          listId={1}
          title="Public List"
          recipeCount={2}
          isPublic={true}
        />
      </MemoryRouter>
    );

    expect(screen.getByTitle("Public")).toBeInTheDocument();
  });

  test("shows private icon when isPublic=false", () => {
    render(
      <MemoryRouter>
        <ListCard
          listId={1}
          title="Private List"
          recipeCount={2}
          isPublic={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByTitle("Private")).toBeInTheDocument();
  });

  test("clicking the card navigates to the list page", () => {
    render(
      <MemoryRouter>
        <ListCard
          listId={42}
          title="Example List"
          recipeCount={4}
          isPublic={true}
        />
      </MemoryRouter>
    );

    const card = screen.getByText("Example List").closest("div");
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/lists/42");
  });

  test("clicking 'Add to My Lists' triggers onCopyList without navigating", () => {
    const mockCopy = vi.fn();

    render(
      <MemoryRouter>
        <ListCard
          listId={99}
          title="Copyable List"
          recipeCount={5}
          isPublic={true}
          onCopyList={mockCopy}
        />
      </MemoryRouter>
    );

    const copyButton = screen.getByText("Add to My Lists");

    fireEvent.click(copyButton);

    expect(mockCopy).toHaveBeenCalledWith(99, "Copyable List");
    expect(mockNavigate).not.toHaveBeenCalled(); // stopPropagation worked
  });
});
