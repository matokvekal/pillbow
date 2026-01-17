import React, { useState, useRef, useEffect } from "react";
import { Medication } from "../../types";
import "./ScanScreen.css";

interface ScanScreenProps {
  onBack: () => void;
  onScanComplete: (medication: Partial<Medication>) => void;
  onManualFallback: () => void;
}

type ScanState = "ready" | "scanning" | "processing" | "done";

// Demo AI function - simulates OCR reading pill box
const demoAIReadPillBox = async (): Promise<Partial<Medication>> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Demo medications that AI might "detect"
  const demoMeds: Partial<Medication>[] = [
    {
      name: "Aspirin",
      strength: "100mg",
      dosage: "1 tablet",
      dosesPerDay: 1,
      timesOfDay: ["Morning"],
      color: "bg-blue-300",
      company: "Bayer",
      instructions: "Take with food",
    },
    {
      name: "Metformin",
      strength: "500mg",
      dosage: "1 tablet",
      dosesPerDay: 2,
      timesOfDay: ["Morning", "Evening"],
      color: "bg-green-300",
      company: "Generic",
      instructions: "Take with meals",
    },
    {
      name: "Lisinopril",
      strength: "10mg",
      dosage: "1 tablet",
      dosesPerDay: 1,
      timesOfDay: ["Morning"],
      color: "bg-purple-300",
      company: "Zestril",
      instructions: "Take at same time daily",
    },
  ];

  // Return random demo medication
  return demoMeds[Math.floor(Math.random() * demoMeds.length)];
};

export const ScanScreen: React.FC<ScanScreenProps> = ({
  onBack,
  onScanComplete,
  onManualFallback,
}) => {
  const [scanState, setScanState] = useState<ScanState>("ready");
  const [hasCamera, setHasCamera] = useState(true);
  const [detectedMed, setDetectedMed] = useState<Partial<Medication> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log("Camera not available:", err);
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = async () => {
    setScanState("scanning");

    // Animate radar for 1.5 seconds
    await new Promise(resolve => setTimeout(resolve, 1500));

    setScanState("processing");

    // Call demo AI
    try {
      const medication = await demoAIReadPillBox();
      setDetectedMed(medication);
      setScanState("done");
    } catch (err) {
      console.error("AI processing failed:", err);
      setScanState("ready");
    }
  };

  const handleConfirm = () => {
    if (detectedMed) {
      onScanComplete(detectedMed);
    }
  };

  const handleRetry = () => {
    setDetectedMed(null);
    setScanState("ready");
  };

  return (
    <div className="scan-screen">
      {/* Header */}
      <div className="scan-screen__header">
        <button className="scan-screen__back-btn" onClick={onBack}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>BACK</span>
        </button>
      </div>

      {/* Camera View */}
      <div className="scan-screen__camera-area">
        {hasCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="scan-screen__video"
          />
        ) : (
          <div className="scan-screen__no-camera">
            <span className="scan-screen__no-camera-icon">📷</span>
            <p>Camera not available</p>
          </div>
        )}

        {/* Radar overlay */}
        {scanState === "scanning" && (
          <div className="scan-screen__radar">
            <div className="scan-screen__radar-ring scan-screen__radar-ring--1" />
            <div className="scan-screen__radar-ring scan-screen__radar-ring--2" />
            <div className="scan-screen__radar-ring scan-screen__radar-ring--3" />
            <div className="scan-screen__radar-sweep" />
          </div>
        )}

        {/* Processing overlay */}
        {scanState === "processing" && (
          <div className="scan-screen__processing">
            <div className="scan-screen__spinner" />
            <p className="scan-screen__processing-text">AI Reading...</p>
          </div>
        )}

        {/* Scan frame */}
        {scanState === "ready" && (
          <div className="scan-screen__frame">
            <div className="scan-screen__corner scan-screen__corner--tl" />
            <div className="scan-screen__corner scan-screen__corner--tr" />
            <div className="scan-screen__corner scan-screen__corner--bl" />
            <div className="scan-screen__corner scan-screen__corner--br" />
          </div>
        )}
      </div>

      {/* Bottom area */}
      <div className="scan-screen__bottom">
        {scanState === "ready" && (
          <>
            <p className="scan-screen__hint">
              Point camera at pill box
            </p>
            <button
              className="scan-screen__capture-btn"
              onClick={handleCapture}
            >
              <div className="scan-screen__capture-inner" />
            </button>
            <button
              className="scan-screen__manual-btn"
              onClick={onManualFallback}
            >
              ✍️ Fill by hand instead
            </button>
          </>
        )}

        {scanState === "scanning" && (
          <p className="scan-screen__hint scan-screen__hint--scanning">
            Scanning...
          </p>
        )}

        {scanState === "processing" && (
          <p className="scan-screen__hint">
            AI is reading the label...
          </p>
        )}

        {scanState === "done" && detectedMed && (
          <div className="scan-screen__result">
            <div className="scan-screen__detected">
              <div className={`scan-screen__med-icon ${detectedMed.color}`}>
                💊
              </div>
              <div className="scan-screen__med-info">
                <h3 className="scan-screen__med-name">{detectedMed.name}</h3>
                <p className="scan-screen__med-strength">{detectedMed.strength}</p>
              </div>
            </div>

            <div className="scan-screen__result-actions">
              <button
                className="scan-screen__confirm-btn"
                onClick={handleConfirm}
              >
                <span>✓</span>
                <span>YES, ADD IT</span>
              </button>
              <button
                className="scan-screen__retry-btn"
                onClick={handleRetry}
              >
                🔄 Scan again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
