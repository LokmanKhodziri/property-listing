import React, { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Geist } from "next/font/google";
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SAMPLE_BODY = { bathRooms: [1], name: "test" };

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Client-side endpoint: prefer NEXT_PUBLIC_, fall back to server-only env or mock
  const endpoint =
    (process.env.NEXT_PUBLIC_PROPERTY_LISTING_ENDPOINT as string) ||
    (process.env.PROPERTY_LISTING_ENDPOINT as string) ||
    "https://agents.propertygenie.com.my/api/properties-mock";

  const baseEndpoint = endpoint.split("?")[0];
  const defaultQuery = "page=1&sort=-price";
  const displayEndpoint = endpoint.includes("?") ? endpoint : `${endpoint}?${defaultQuery}`;

  const sendTestRequest = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await axios.post(
        baseEndpoint,
        SAMPLE_BODY,
        {
          params: { page: 1, sort: "-price" },
          headers: { "Content-Type": "application/json" },
        }
      );
      setResponse({ status: res.status, data: res.data });
    } catch (err: any) {
      const msg = err?.response?.data || err?.message || String(err);
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const curl = `curl --location '${displayEndpoint}' \\
  --header 'Content-Type: application/json' \\
  --data '${JSON.stringify(SAMPLE_BODY)}'`;

  return (
    <div className={`${styles.page} ${geistSans.variable}`}>
      <Head>
        <title>API Tester — Property Listings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <h1>Property API Tester</h1>

        <p>
          Endpoint: <code>{endpoint}</code>
        </p>

        <button onClick={sendTestRequest} disabled={loading} style={{ marginBottom: 12 }}>
          {loading ? "Sending..." : "Send test request"}
        </button>

        <div style={{ marginBottom: 12 }}>
          <strong>Sample curl</strong>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f8fa", padding: 8 }}>{curl}</pre>
        </div>

        {error && (
          <div style={{ color: "#b00020" }}>
            <strong>Error:</strong>
            <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
          </div>
        )}

        {response && (
          <div style={{ marginTop: 12, width: "100%" }}>
            <strong>Response (status {response.status}):</strong>
            <pre style={{ whiteSpace: "pre-wrap", maxHeight: 400, overflow: "auto", background: "#f6f8fa", padding: 8 }}>{JSON.stringify(response.data, null, 2)}</pre>
          </div>
        )}

        <p style={{ marginTop: 24, fontSize: 12, color: "#666" }}>
          Tip: To allow client-side requests in production, set <code>NEXT_PUBLIC_PROPERTY_LISTING_ENDPOINT</code> in your environment.
        </p>
      </main>
    </div>
  );
}
