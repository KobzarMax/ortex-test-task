import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import MarketData from "../MarketData";

const mockWebSocketInstances: MockWebSocket[] = [];

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  url: string;

  constructor(url: string) {
    this.url = url;
    mockWebSocketInstances.push(this);
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event("open"));
      }
    }, 100);
  }

  send(data: string) {
    console.log("WebSocket send:", data);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent("close"));
    }
  }

  simulateMessage(data: Record<string, unknown>) {
    if (this.onmessage) {
      this.onmessage(
        new MessageEvent("message", { data: JSON.stringify(data) })
      );
    }
  }

  simulateError() {
    if (this.onerror) {
      this.onerror(new Event("error"));
    }
  }
}

global.WebSocket = MockWebSocket as unknown as typeof WebSocket;

describe("MarketData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWebSocketInstances.length = 0;
  });

  it("renders initial state correctly", () => {
    render(<MarketData />);

    expect(screen.getByText("EUR/USD Exchange Rate")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByText("Waiting for data...")).toBeInTheDocument();
    expect(screen.getByText("Connecting...")).toBeInTheDocument();
  });

  it("shows connected status when WebSocket connects", async () => {
    render(<MarketData />);

    await waitFor(() => {
      expect(screen.getByText("Live")).toBeInTheDocument();
    });

    const statusDot = document.querySelector(".status-dot");
    expect(statusDot).toHaveClass("connected");
  });

  it("displays price and timestamp when data is received", async () => {
    render(<MarketData />);

    await waitFor(() => {
      expect(screen.getByText("Live")).toBeInTheDocument();
    });

    const mockData = {
      price: "1.08456",
      dt: "2023-12-16T10:30:00Z",
    };

    const wsInstance = mockWebSocketInstances[0];
    if (wsInstance) {
      wsInstance.simulateMessage(mockData);
    }

    await waitFor(() => {
      expect(screen.getByText("$1.08456")).toBeInTheDocument();
    });

    const timestampElement = screen.getByText((content, element) => {
      return element?.className === "timestamp" && content.length > 0;
    });
    expect(timestampElement).toBeInTheDocument();
  });

  it("handles WebSocket errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<MarketData />);

    await waitFor(() => {
      expect(screen.getByText("Live")).toBeInTheDocument();
    });

    const wsInstance = mockWebSocketInstances[0];
    if (wsInstance) {
      wsInstance.simulateError();
    }

    await waitFor(() => {
      expect(screen.getByText("Connecting...")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("handles invalid JSON messages gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<MarketData />);

    await waitFor(() => {
      expect(screen.getByText("Live")).toBeInTheDocument();
    });

    const wsInstance = mockWebSocketInstances[0];
    if (wsInstance && wsInstance.onmessage) {
      wsInstance.onmessage(
        new MessageEvent("message", { data: "invalid json" })
      );
    }

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("formats price to 5 decimal places", async () => {
    render(<MarketData />);

    await waitFor(() => {
      expect(screen.getByText("Live")).toBeInTheDocument();
    });

    const mockData = {
      price: "1.084567891",
      dt: "2023-12-16T10:30:00Z",
    };

    const wsInstance = mockWebSocketInstances[0];
    if (wsInstance) {
      wsInstance.simulateMessage(mockData);
    }
    await waitFor(() => {
      expect(screen.getByText("$1.08457")).toBeInTheDocument();
    });
  });

  it("ignores messages without required fields", async () => {
    render(<MarketData />);

    await waitFor(() => {
      expect(screen.getByText("Live")).toBeInTheDocument();
    });

    // Send message without price
    const incompleteData = { dt: "2023-12-16T10:30:00Z" };

    const wsInstance = mockWebSocketInstances[0];
    if (wsInstance) {
      wsInstance.simulateMessage(incompleteData);
    }

    // Should still show loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("cleans up WebSocket on unmount", () => {
    const { unmount } = render(<MarketData />);

    const wsInstance = mockWebSocketInstances[0];
    const closeSpy = vi.spyOn(wsInstance, "close");

    unmount();

    expect(closeSpy).toHaveBeenCalled();
  });
});
