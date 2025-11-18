import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import SideBar from "./SideBar";
import { BrowserRouter } from "react-router-dom";

// Create a variable to hold the navigate mock
let navigateMock = vi.fn();

// Mock react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

describe("SideBar Component", () => {
    beforeEach(() => {
        navigateMock = vi.fn(); // reset the mock for each test
    });

    const renderSideBar = () =>
        render(
            <BrowserRouter>
                <SideBar />
            </BrowserRouter>
        );

    it("renders all buttons", () => {
        renderSideBar();
        ["Home", "Pantry", "Favorites", "Meal Plan", "My Lists", "New Recipe", "Settings"].forEach((text) => {
            expect(screen.getByText(text)).toBeTruthy();
        });
    });

    it("calls navigate when buttons are clicked", () => {
        renderSideBar();

        fireEvent.click(screen.getByText("Home"));
        expect(navigateMock).toHaveBeenCalledWith("/home");

        fireEvent.click(screen.getByText("Pantry"));
        expect(navigateMock).toHaveBeenCalledWith("/pantry");
    });

    it("applies hover transform on mouse enter and leave", () => {
        const { container } = renderSideBar();
        const sidebar = container.firstChild;

        expect(sidebar.style.transform).toBe("translateX(-80%)");

        fireEvent.mouseEnter(sidebar);
        expect(sidebar.style.transform).toBe("translateX(-10%)");

        fireEvent.mouseLeave(sidebar);
        expect(sidebar.style.transform).toBe("translateX(-80%)");
    });
});
