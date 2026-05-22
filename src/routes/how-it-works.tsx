import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorks,
  head: () => ({
    meta: [
      { title: "How It Works — OncoScan AI" },
      { name: "description", content: "An end-to-end walkthrough of the OncoScan AI pipeline from data to deployment." },
    ],
  }),
});

const STEPS = [
  {
    n: "01",
    icon: "🗂",
    title: "Image Collection",
    text: "We use the Kaggle Breast Histopathology Images dataset — a curated collection of 277,524 image patches extracted from 162 whole-slide images, each labeled IDC-positive or IDC-negative.",
  },
  {
    n: "02",
    icon: "⚙️",
    title: "Data Preprocessing",
    text: "Each image is resized, normalized, and pushed through an augmentation pipeline including horizontal/vertical flips and random rotations to improve generalization across staining variations.",
  },
  {
    n: "03",
    icon: "🧠",
    title: "Model Architecture",
    text: "A MobileNetV2 base pretrained on ImageNet, followed by GlobalAveragePooling, a Dense(128, ReLU) layer, Dropout(0.3) for regularization, and a final sigmoid neuron for binary classification.",
  },
  {
    n: "04",
    icon: "🎯",
    title: "Training",
    text: "Trained with binary cross-entropy loss and the Adam optimizer over 5 epochs, using class weights to compensate for the imbalanced positive/negative distribution.",
  },
  {
    n: "05",
    icon: "🚀",
    title: "API Deployment",
    text: "The trained model is served behind a FastAPI REST endpoint. POST an image to /predict and receive a JSON response with the predicted class and a confidence score.",
  },
  {
    n: "06",
    icon: "💻",
    title: "Frontend Integration",
    text: "A React + TypeScript app uploads the patch as multipart form data, displays the prediction with an animated confidence visualization, and gracefully handles connection failures.",
  },
];

const STACK = ["Python", "TensorFlow", "Keras", "FastAPI", "React", "TypeScript", "Tailwind CSS", "Framer Motion"];

function HowItWorks() {
  return (
    <div className="relative pt-28 pb-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#eef4ff] via-surface to-surface" />

      <section className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-4">Architecture</div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-navy tracking-tight leading-[1.05]">How It Works</h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            From raw histopathology slides to a live diagnostic API — here is the complete OncoScan AI pipeline.
          </p>
        </motion.div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-7 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-teal-400 to-[#1a1040]" />

          <div className="space-y-12">
            {STEPS.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <Reveal key={s.n} delay={0.05}>
                  <div className={`relative flex md:items-center ${left ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* dot */}
                    <div className="absolute left-7 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-4 border-primary z-10 shadow-lg shadow-primary/40" />

                    <div className={`pl-20 md:pl-0 md:w-1/2 ${left ? "md:pr-16" : "md:pl-16"}`}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="glass rounded-2xl p-6 md:p-8"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-[#1a1040] text-white flex items-center justify-center text-2xl">
                            {s.icon}
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-widest text-primary font-bold">Step {s.n}</div>
                            <div className="text-xl font-extrabold text-navy">{s.title}</div>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{s.text}</p>
                      </motion.div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-12">
        <Reveal>
          <div className="glass rounded-3xl p-10 md:p-14 text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-3">Tech Stack</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-8">Built with modern tools</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {STACK.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-br from-white to-blue-50 border border-border text-navy font-semibold text-sm shadow-sm hover:shadow-md hover:scale-105 transition"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
