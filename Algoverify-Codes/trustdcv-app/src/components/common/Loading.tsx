import React from "react";
import { Spinner } from "react-bootstrap";

export function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.2)",
        zIndex: 9999,
      }}
    >
      <Spinner animation="border" role="status" variant="light">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <div style={{ marginLeft: "10px", color: "#fff" }}>Loading...</div>
    </div>
  );
}
