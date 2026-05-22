import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "OncoScan AI — Breast Cancer Detection System" },
      { name: "description", content: "AI-powered histopathology image analysis for early breast cancer detection using deep learning." },
    ],
  }),
});

type Result = { prediction: "malignant" | "benign"; confidence: number };

function DnaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <path d="M4 4c4 4 12 12 16 16M20 4C16 8 8 16 4 20M7 5h10M7 19h10M5 8h14M5 16h14" />
    </svg>
  );
}

function MicroscopeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2M9 12a2 2 0 0 1-2-2V6h4v4a2 2 0 0 1-2 2zM12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  );
}

function CloudUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.5 19a4.5 4.5 0 1 0-1.6-8.7 6 6 0 0 0-11.7 1.7A4 4 0 0 0 5 19" />
      <path d="M12 12v9M8 16l4-4 4 4" />
    </svg>
  );
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/") && !/\.(tiff?|jpe?g|png)$/i.test(f.name)) {
      toast.error("Please upload a JPG, PNG, or TIFF image.");
      return;
    }
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("http://localhost:8000/predict", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Bad response");
      const data = await res.json();
      const prediction: "malignant" | "benign" =
        (data.prediction || data.class || data.label || "").toString().toLowerCase().includes("malign") ||
        data.prediction === 1 || data.class === 1
          ? "malignant"
          : "benign";
      const confidence = Number(data.confidence ?? data.probability ?? data.score ?? 0);
      const normalized = confidence > 1 ? confidence : confidence * 100;
      setResult({ prediction, confidence: Math.min(100, Math.max(0, normalized)) });
    } catch {
      toast.error("Could not connect to analysis server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <Toaster position="top-right" richColors />

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-navy text-navy-foreground flex items-center justify-center">
              <DnaIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold tracking-tight text-navy text-lg leading-none">OncoScan AI</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">Medical Diagnostic</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-primary bg-accent px-3 py-1.5 rounded-full border border-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Powered by Deep Learning
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="relative bg-navy text-navy-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,64,175,0.4),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.2),transparent_60%)]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/30 blur-3xl pulse-glow" />
          <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pulse-glow" style={{ animationDelay: "2s" }} />
          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-blue-300 mb-5 font-semibold">
              <span className="w-8 h-px bg-blue-400" />
              Histopathology AI
            </motion.div>
            <motion.h1 {...fadeUp(0.08)} className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl leading-[1.05]">
              Breast Cancer Detection System
            </motion.h1>
            <motion.p {...fadeUp(0.16)} className="mt-5 text-lg md:text-xl text-blue-100/80 max-w-2xl font-light">
              AI-powered histopathology image analysis for early cancer detection.
            </motion.p>
            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-wrap gap-3 text-xs text-blue-200/70">
              <span className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10">CNN · MobileNetV2</span>
              <span className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10">89% Accuracy</span>
              <span className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10">IDC Detection</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left col */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-3 space-y-6">
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-xl font-bold text-navy">Image Analysis</h2>
                <span className="text-xs text-muted-foreground font-medium">Step 1 of 2</span>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-all ${
                  dragOver ? "border-primary bg-accent" : "border-border hover:border-primary/50 hover:bg-accent/40"
                } ${previewUrl ? "p-4" : "p-12"}`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/tiff,.tif,.tiff"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <AnimatePresence mode="wait">
                  {previewUrl ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="flex flex-col items-center"
                    >
                      <div className="rounded-lg overflow-hidden border border-border bg-muted max-w-xs">
                        <img src={previewUrl} alt="Histopathology preview" className="w-full h-auto block" />
                      </div>
                      <div className="mt-4 text-center">
                        <div className="text-sm font-semibold text-navy truncate max-w-xs">{file?.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {file && (file.size / 1024).toFixed(1)} KB · Click or drop to replace
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-accent text-primary flex items-center justify-center mb-4">
                        <CloudUpIcon className="w-8 h-8" />
                      </div>
                      <div className="text-base font-semibold text-navy">Drop histopathology image here</div>
                      <div className="text-sm text-muted-foreground mt-1.5">Supports JPG, PNG, TIFF formats</div>
                      <div className="text-xs text-muted-foreground mt-4 font-medium">or click to browse</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={analyze}
                disabled={!file || loading}
                className="mt-6 w-full h-14 rounded-lg bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2.5 transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-primary/20"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Analyzing tissue sample...
                  </>
                ) : (
                  <>
                    <MicroscopeIcon className="w-5 h-5" />
                    Analyze Image
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
                  style={{ borderLeftWidth: 6, borderLeftColor: result.prediction === "malignant" ? "#dc2626" : "#16a34a" }}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-wide ${
                          result.prediction === "malignant"
                            ? "bg-red-50 text-malignant border border-red-200"
                            : "bg-green-50 text-benign border border-green-200"
                        }`}
                      >
                        {result.prediction === "malignant" ? (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="10" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                        {result.prediction === "malignant" ? "IDC POSITIVE — MALIGNANT" : "IDC NEGATIVE — BENIGN"}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Analysis Complete</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Confidence Score</span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-3xl font-bold text-navy tabular-nums"
                        >
                          {result.confidence.toFixed(1)}%
                        </motion.span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence}%` }}
                          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: result.prediction === "malignant" ? "#dc2626" : "#16a34a" }}
                        />
                      </div>
                    </div>

                    <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-navy">IDC (Invasive Ductal Carcinoma)</span> is the most common form of
                      breast cancer, where abnormal cells originate in the milk ducts and invade surrounding breast tissue. Early detection
                      significantly improves treatment outcomes.
                    </p>

                    <div className="mt-6 pt-5 border-t border-border">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <span className="font-semibold">Disclaimer:</span> This tool is intended for educational and research purposes only.
                        Results should not be used as a substitute for professional medical diagnosis.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right col */}
          <motion.aside {...fadeUp(0.18)} className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Model Accuracy", value: "89%", icon: "📊" },
                { label: "Images Trained", value: "50K+", icon: "🧬" },
                { label: "Detection", value: "IDC", icon: "🔬" },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-card rounded-xl border border-border shadow-sm p-4 text-center"
                >
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold text-navy tabular-nums">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
              <h3 className="text-base font-bold text-navy mb-3">About This Tool</h3>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Invasive Ductal Carcinoma (IDC) is the most prevalent subtype of breast cancer, accounting for roughly 80% of all cases.
                </p>
                <p>
                  Our AI uses a <span className="font-semibold text-navy">Convolutional Neural Network</span> (MobileNetV2) trained on tens
                  of thousands of histopathology patches to identify cancerous tissue patterns.
                </p>
                <p>
                  For best results, upload <span className="font-semibold text-navy">50×50 pixel tissue patches</span> from H&E-stained
                  histopathology slides.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
              <h3 className="text-base font-bold text-navy mb-4">How To Use</h3>
              <ol className="space-y-3.5">
                {[
                  "Upload a histopathology patch image",
                  "Click the Analyze Image button",
                  "Read your result and confidence score",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-primary text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground/80 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-navy-foreground mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-blue-100/80">
            <DnaIcon className="w-4 h-4" />
            OncoScan AI — Built for educational purposes
          </div>
          <div className="text-xs text-blue-200/60">
            Model: MobileNetV2 — Dataset: Breast Histopathology Images (Kaggle)
          </div>
        </div>
      </footer>
    </div>
  );
}
