import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import ResetPasswordModal from "../ResetPasswordModal";

// Mock window.alert
global.alert = vi.fn();

describe("ResetPasswordModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(<ResetPasswordModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByText("Reset Password")).not.toBeInTheDocument();
  });

  it("renders modal when isOpen is true", () => {
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your email address and we'll send you a link to reset your password."
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Reset Link" })
    ).toBeInTheDocument();
  });

  it("closes modal when close button is clicked", () => {
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button", { name: "" }); // X button
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("closes modal when overlay is clicked", () => {
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} />);

    const overlay = screen
      .getByText("Reset Password")
      .closest(".modal-overlay");
    fireEvent.click(overlay!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not close modal when modal content is clicked", () => {
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} />);

    const modalContent = screen.getByText("Reset Password").closest(".modal");
    fireEvent.click(modalContent!);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("updates email input when user types", () => {
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} />);

    const emailInput = screen.getByLabelText("Email Address");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("submits form with valid email", async () => {
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} />);

    const emailInput = screen.getByLabelText("Email Address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(
      () => {
        expect(global.alert).toHaveBeenCalledWith(
          "Password reset link sent to your email!"
        );
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 }
    );
  });

  it("shows loading state during form submission", () => {
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} />);

    const emailInput = screen.getByLabelText("Email Address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toContainHTML('<span class="loading"></span>');
  });

  it("clears email field after successful submission", async () => {
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} />);

    const emailInput = screen.getByLabelText("Email Address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(emailInput).toHaveValue("");
      },
      { timeout: 2000 }
    );
  });

  it("requires email field to be filled", () => {
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} />);

    const emailInput = screen.getByLabelText("Email Address");
    expect(emailInput).toHaveAttribute("required");
    expect(emailInput).toHaveAttribute("type", "email");
  });
});
