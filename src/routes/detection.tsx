import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/detection")({
  component: Detection,
  head: () => ({
    meta: [
      { title: "Detection — OncoScan AI" },
      { name: "description", content: "Upload a histopathology image and get an AI-powered IDC prediction with confidence score." },
    ],
  }),
});

type Result = { prediction: "malignant" | "benign"; confidence: number };

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

function Detection() {
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
    setPreviewUrl(URL.createObjectURL(f));
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

  const isMal = result?.prediction === "malignant";
  const chartData = result ? [
    { name: "Predicted", value: result.confidence },
    { name: "Other", value: 100 - result.confidence },
  ] : [];
  const chartColor = isMal ? "#dc2626" : "#16a34a";

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      {/* soft gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#eef2f7] via-surface to-surface" />
      <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-96 -left-40 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-3">Diagnostic Console</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight">Image Detection</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">Upload a histopathology patch image and our model will return an IDC prediction along with a confidence score.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-3 space-y-6">
            <div className="glass rounded-2xl p-6 md:p-8">
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-xl font-bold text-navy">Image Analysis</h2>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Step 1 of 2</span>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all ${
                  dragOver ? "border-primary bg-accent/60" : "border-border hover:border-primary/50 hover:bg-accent/30"
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
                    <motion.div key="preview" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                      <div className="rounded-lg overflow-hidden border border-border bg-muted max-w-xs">
                        <img src={previewUrl} alt="Preview" className="w-full h-auto block" />
                      </div>
                      <div className="mt-4 text-center">
                        <div className="text-sm font-semibold text-navy truncate max-w-xs">{file?.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {file && (file.size / 1024).toFixed(1)} KB · Click or drop to replace
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-teal-500/10 text-primary flex items-center justify-center mb-4">
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
                className="btn-shimmer mt-6 w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2.5 hover:bg-primary/90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
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
                  <><MicroscopeIcon className="w-5 h-5" /> Analyze Image</>
                )}
              </button>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`glass rounded-2xl overflow-hidden ${isMal ? "glow-red" : "glow-green"}`}
                  style={{ borderLeftWidth: 6, borderLeftColor: isMal ? "#dc2626" : "#16a34a" }}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-wide ${
                        isMal ? "bg-red-50 text-malignant border border-red-200" : "bg-green-50 text-benign border border-green-200"
                      }`}>
                        {isMal ? "IDC POSITIVE — MALIGNANT" : "IDC NEGATIVE — BENIGN"}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Analysis Complete</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Confidence Score</span>
                          <span className="text-4xl font-extrabold text-navy tabular-nums">{result.confidence.toFixed(1)}%</span>
                        </div>
                        <div className="mt-3 h-2.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }}
                            transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: chartColor }}
                          />
                        </div>
                        <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                          <span className="font-semibold text-navy">IDC (Invasive Ductal Carcinoma)</span> is the most common form of breast cancer. Early detection significantly improves treatment outcomes.
                        </p>
                      </div>
                      <div className="relative h-52">
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={chartData}
                              dataKey="value"
                              innerRadius={55}
                              outerRadius={85}
                              startAngle={90}
                              endAngle={-270}
                              stroke="none"
                              animationDuration={1100}
                            >
                              <Cell fill={chartColor} />
                              <Cell fill="#e2e8f0" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <div className="text-2xl font-extrabold text-navy">{result.confidence.toFixed(0)}%</div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{isMal ? "Malignant" : "Benign"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-border">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <span className="font-semibold">Disclaimer:</span> This tool is intended for educational and research purposes only. Results should not be used as a substitute for professional medical diagnosis.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-base font-bold text-navy mb-3">About This Tool</h3>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>Invasive Ductal Carcinoma (IDC) is the most prevalent subtype of breast cancer, accounting for roughly 80% of all cases.</p>
                <p>Our AI uses a <span className="font-semibold text-navy">Convolutional Neural Network</span> (MobileNetV2) trained on tens of thousands of histopathology patches.</p>
                <p>For best results, upload <span className="font-semibold text-navy">50×50 pixel tissue patches</span> from H&E-stained slides.</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-base font-bold text-navy mb-4">How To Use</h3>
              <ol className="space-y-3.5">
                {[
                  "Upload a histopathology patch image",
                  "Click the Analyze Image button",
                  "Review prediction and confidence score",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">{i + 1}</span>
                    <span className="text-muted-foreground leading-relaxed pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-base font-bold text-navy mb-3">Model Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Architecture</dt><dd className="font-semibold text-navy">MobileNetV2</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Accuracy</dt><dd className="font-semibold text-navy">89%</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Dataset</dt><dd className="font-semibold text-navy">Kaggle BHI</dd></div>
              </dl>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
