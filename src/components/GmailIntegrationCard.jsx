"use client";
import { useEffect, useState } from "react";

export default function GmailIntegrationCard() {
  const [status, setStatus] = useState("loading");

  const checkGmailStatus = () => {
    fetch("/api/gmail/status")
      .then((res) => res.json())
      .then((data) => setStatus(data.connected ? "connected" : "disconnected"))
      .catch(() => setStatus("disconnected"));
  };

  const handleConnect = () => {
    window.location.href = "/api/gmail/connect";
  };

  const handleDisconnect = async () => {
    const res = await fetch("/api/gmail/disconnect", { method: "POST" });
    if (res.ok) setStatus("disconnected");
  };

  return (
    <div className="rounded-2xl p-4 shadow bg-white border w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2">Gmail Integration</h2>
      {status === "loading" && (
        <button className="btn" onClick={checkGmailStatus}>
          Check Gmail Status
        </button>
      )}
      {status === "connected" && "Your Gmail is connected."}
      {status === "disconnected" && "Gmail is not connected."}
      <div className="flex gap-2">
        {status === "connected" ? (
          <button
            onClick={handleDisconnect}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={handleConnect}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Connect Gmail
          </button>
        )}
      </div>
    </div>
  );
}
