import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

function CameraScan() {
  const videoRef = useRef(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    // Get all video input devices
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        if (videoDevices.length > 0) {
          // Prefer rear/back camera
          const rearCamera = videoDevices.find((d) =>
            d.label.toLowerCase().includes("back")
          );
          const deviceId = rearCamera
            ? rearCamera.deviceId
            : videoDevices[0].deviceId;

          // Start decoding from the video device
          codeReader.decodeFromVideoDevice(
            deviceId,
            videoRef.current,
            (result, err) => {
              if (result) setResult(result.getText());

              // Ignore NotFoundException and NotFoundException2 (normal scanning frames)
              if (
                err &&
                err.name !== "NotFoundException" &&
                err.name !== "NotFoundException2"
              ) {
                console.error(err);
              }
            }
          );
        }
      })
      .catch(console.error);

    // Cleanup camera on unmount
    return () => codeReader.reset();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#000",
        color: "#fff",
      }}
    >
      <h2>QR Code Scanner</h2>

      <div
        style={{
          width: "90%",
          maxWidth: "400px",
          aspectRatio: "1/1",
          position: "relative",
          border: "3px solid #fff",
          borderRadius: "12px",
          overflow: "hidden",
          marginTop: "1rem",
        }}
      >
        <video
          ref={videoRef}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          autoPlay
          muted
        />

        {/* Overlay for scanning */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "2px dashed rgba(255,255,255,0.5)",
            boxSizing: "border-box",
          }}
        ></div>
      </div>

      <p style={{ marginTop: "1rem", wordBreak: "break-word" }}>
        Scanned Result: {result || "No QR code detected yet"}
      </p>
    </div>
  );
}

export default CameraScan;
