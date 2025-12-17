import { useState, useEffect, useRef } from "react";

interface MarketDataType {
  price: string | null;
  timestamp: string | null;
}

const useWebSocket = () => {
  const [data, setData] = useState<MarketDataType>({
    price: null,
    timestamp: null,
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = () => {
    try {
      wsRef.current = new WebSocket(
        "ws://stream.tradingeconomics.com/?client=guest:guest"
      );

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        wsRef.current?.send(
          JSON.stringify({
            topic: "subscribe",
            to: "EURUSD:CUR",
          })
        );
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.price && message.dt) {
            setData({
              price: parseFloat(message.price).toFixed(5),
              timestamp: new Date(message.dt).toLocaleString(),
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        reconnectTimeoutRef.current = setTimeout(
          connect,
          3000
        ) as unknown as number;
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(
        connect,
        3000
      ) as unknown as number;
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { data, isConnected };
};

const MarketData = () => {
  const { data, isConnected } = useWebSocket();

  return (
    <div className="market-data">
      <h3>EUR/USD Exchange Rate</h3>
      <div className="price-display">
        {data.price ? `$${data.price}` : "Loading..."}
      </div>
      <div className="timestamp">{data.timestamp || "Waiting for data..."}</div>
      <div className="connection-status">
        <span className={`status-dot ${isConnected ? "connected" : ""}`}></span>
        {isConnected ? "Live" : "Connecting..."}
      </div>
    </div>
  );
};

export default MarketData;
