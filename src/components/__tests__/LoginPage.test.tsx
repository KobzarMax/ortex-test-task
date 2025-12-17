import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import LoginPage from "../LoginPage";

// Mock the child components
vi.mock("../ResetPasswordModal", () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="reset-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

vi.mock("../MarketData", () => ({
  default: () => <div data-testid="market-data">Market Data Component</div>,
}));

// Mock fetch
global.fetch = vi.fn();

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form with all elements", () => {
    render(<LoginPage />);

    expect(screen.getByText("ORTEX")).toBeInTheDocument();
    expect(
      screen.getByText("Financial Intelligence Platform")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Username or Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
    expect(screen.getByTestId("market-data")).toBeInTheDocument();
  });

  it("updates form fields when user types", () => {
    render(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username or Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  it("toggles password visibility", () => {
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button", { name: "" }); // Eye icon button

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("submits form with valid data", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    render(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username or Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser",
          password: "password123",
        }),
      });
    });
  });

  it("shows loading state during form submission", async () => {
    render(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username or Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toContainHTML('<span class="loading"></span>');
  });

  it("opens reset password modal when forgot password is clicked", () => {
    render(<LoginPage />);

    const forgotPasswordButton = screen.getByText("Forgot your password?");
    fireEvent.click(forgotPasswordButton);

    expect(screen.getByTestId("reset-modal")).toBeInTheDocument();
  });

  it("closes reset password modal", () => {
    render(<LoginPage />);

    const forgotPasswordButton = screen.getByText("Forgot your password?");
    fireEvent.click(forgotPasswordButton);

    const closeButton = screen.getByText("Close Modal");
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("reset-modal")).not.toBeInTheDocument();
  });

  it("prevents form submission with empty fields", () => {
    render(<LoginPage />);

    const submitButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.click(submitButton);

    // Form should not submit due to required fields (HTML5 validation)
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
