import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import App from "../App";

// Mock the LoginPage component
vi.mock("../components/LoginPage", () => ({
  default: () => <div data-testid="login-page">Login Page Component</div>,
}));

describe("App", () => {
  it("renders LoginPage component", () => {
    render(<App />);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });
});
