import React, { useState, useRef, useEffect } from "react";
import { Medication } from "../../types";
import { MedIcon } from "../MedIcons";
import "./ScanScreen.css";

interface ScanScreenProps {
  onBack: () => void;
  onScanComplete: (medication: Partial<Medication>) => void;
  onManualFallback: () => void;
}

type ScanState = "camera" | "scanning" | "result";

// Demo AI function - simulates reading pill box
const simulateAIRead = async (): Promise<Partial<Medication>> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const demoMeds: Partial<Medication>[] = [
    { name: "Aspirin", strength: "100mg", color: "bg-blue-300" },
    { name: "Metformin", strength: "500mg", color: "bg-green-300" },
    { name: "Lisinopril", strength: "10mg", color: "bg-purple-300" },
    { name: "Vitamin D", strength: "1000 IU", color: "bg-yellow-300" },
  ];

  return demoMeds[Math.floor(Math.random() * demoMeds.length)];
};

export const ScanScreen: React.FC<ScanScreenProps> = ({
  onBack,
  onScanComplete,
  onManualFallback,
}) => {
  const [state, setState] = useState<ScanState>("camera");
  const [hasCamera, setHasCamera] = useState(true);
  const [detectedMed, setDetectedMed] = useState<Partial<Medication> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
    } catch {
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
  };

  const handleCapture = async () => {
    setState("scanning");
    try {
      const med = await simulateAIRead();
      setDetectedMed(med);
      setState("result");
    } catch {
      setState("camera");
    }
  };

  const handleConfirm = () => {
    if (detectedMed) {
      onScanComplete({
        ...detectedMed,
        id: `med-${Date.now()}`,
        dosesPerDay: 1,
        timesOfDay: ["08:00"],
        dosage: "1 dose",
        startDate: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleRetry = () => {
    setDetectedMed(null);
    setState("camera");
  };

  return (
    <div className="scan">
      {/* Header bar */}
      <div className="scan__header">
        <button className="scan__back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Camera view */}
      <div className="scan__camera">
        {hasCamera ? (
          <video ref={videoRef} autoPlay playsInline muted className="scan__video" />
        ) : (
          <div className="scan__no-camera">
            <span>📷</span>
            <p>Camera not available</p>
          </div>
        )}

        {/* Scan frame overlay */}
        {state === "camera" && (
          <div className="scan__frame">
            <div className="scan__frame-inner">
              <div className="scan__frame-row">
                <div className="scan__corner scan__corner--tl" />
                <div className="scan__corner scan__corner--tr" />
              </div>
              <div className="scan__frame-row">
                <div className="scan__corner scan__corner--bl" />
                <div className="scan__corner scan__corner--br" />
              </div>
            </div>
          </div>
        )}

        {/* Scanning animation */}
        {state === "scanning" && (
          <div className="scan__scanning">
            <div className="scan__pulse" />
            <p>Reading...</p>
          </div>
        )}
      </div>



      {/* Bottom panel */}
      <div className="scan__panel">
        {state === "camera" && (
          <>
            <p className="scan__hint">Point at the medicine box</p>
            <button className="scan__capture" onClick={handleCapture}>
              <div className="scan__capture-inner" />
            </button>
            <button className="scan__fallback" onClick={onManualFallback}>
              Type it instead
            </button>
          </>
        )}

        {state === "scanning" && (
          <p className="scan__hint scan__hint--scanning">Analyzing image...</p>
        )}

        {state === "result" && detectedMed && (
          <div className="scan__result">
            <div className="scan__detected">
              <div className={`scan__med-icon ${detectedMed.color}`}>
                <MedIcon shapeId={detectedMed.shape || 'capsule'} size={24} color="white" />
              </div>
              <div className="scan__med-info">
                <p className="scan__med-name">{detectedMed.name}</p>
                <p className="scan__med-strength">{detectedMed.strength}</p>
              </div>
            </div>
            <div className="scan__actions">
              <button className="scan__confirm" onClick={handleConfirm}>
                Yes, Add It
              </button>
              <button className="scan__retry" onClick={handleRetry}>
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
