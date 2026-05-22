import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CountUp, Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about-disease")({
  component: AboutDisease,
  head: () => ({
    meta: [
      { title: "About the Disease — OncoScan AI" },
      { name: "description", content: "Understanding breast cancer, IDC, risk factors, warning signs, and global statistics." },
    ],
  }),
});

const RISK_FACTORS = [
  { icon: "👤", label: "Age", text: "Risk increases significantly after age 50." },
  { icon: "🧬", label: "Genetics", text: "BRCA1/BRCA2 mutations elevate risk." },
  { icon: "👨‍👩‍👧", label: "Family History", text: "First-degree relatives with breast cancer." },
  { icon: "⚖️", label: "Hormones", text: "Long exposure to estrogen and progesterone." },
  { icon: "🍷", label: "Alcohol", text: "Regular alcohol consumption raises risk." },
  { icon: "🏃", label: "Inactivity", text: "Sedentary lifestyle is linked to higher risk." },
];

const WARNING_SIGNS = [
  { title: "New lump or mass", text: "An irregular, painless lump in the breast or underarm." },
  { title: "Skin changes", text: "Dimpling, puckering, redness or thickening of breast skin." },
  { title: "Nipple discharge", text: "Unusual fluid, especially if bloody or from one breast." },
  { title: "Shape changes", text: "Sudden change in breast size, shape, or symmetry." },
  { title: "Inverted nipple", text: "A previously normal nipple turning inward." },
  { title: "Persistent pain", text: "Localized pain that does not go away with cycle changes." },
];

const STAGES = [
  { stage: "0", title: "In Situ", text: "Abnormal cells are present but have not spread beyond the duct." },
  { stage: "I", title: "Early Invasive", text: "Tumor ≤ 2 cm. No or minimal lymph node involvement." },
  { stage: "II", title: "Localized", text: "Tumor 2–5 cm or limited lymph node spread." },
  { stage: "III", title: "Regional Spread", text: "Larger tumors or extensive lymph node involvement." },
  { stage: "IV", title: "Metastatic", text: "Cancer has spread to distant organs such as bones, liver, or lungs." },
];

function AboutDisease() {
  return (
    <div className="relative pt-28 pb-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#eef4ff] via-surface to-surface" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-3xl" />

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-xs uppercase tracking-[0.25em] text-teal-600 font-bold mb-4">Education</div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-navy tracking-tight leading-[1.05]">
            Understanding<br />Breast Cancer
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            A clinical primer on breast cancer, Invasive Ductal Carcinoma, the risk factors that drive it, and the early signs that lead to better outcomes.
          </p>
        </motion.div>
      </section>

      {/* What is breast cancer */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <Reveal>
          <div className="glass rounded-3xl p-8 md:p-12 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-3">01</div>
              <h2 className="text-3xl font-extrabold text-navy">What is Breast Cancer?</h2>
            </div>
            <div className="md:col-span-2 text-lg text-muted-foreground leading-relaxed space-y-4">
              <p>Breast cancer is a disease in which cells in the breast grow uncontrollably. These cells form a tumor that can often be seen on an X-ray or felt as a lump.</p>
              <p>Tumors are malignant when the cells can invade surrounding tissue or spread to distant areas of the body. Breast cancer occurs almost entirely in women, but men can develop it too.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* What is IDC */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <Reveal>
          <div className="glass rounded-3xl p-8 md:p-12 grid md:grid-cols-3 gap-8 bg-gradient-to-br from-white/80 to-teal-50/60">
            <div className="md:col-span-1">
              <div className="text-xs uppercase tracking-[0.25em] text-teal-600 font-bold mb-3">02</div>
              <h2 className="text-3xl font-extrabold text-navy">What is IDC?</h2>
              <div className="mt-4 text-sm text-muted-foreground">Invasive Ductal Carcinoma</div>
            </div>
            <div className="md:col-span-2 text-lg text-muted-foreground leading-relaxed space-y-4">
              <p>IDC begins in the milk ducts and breaks through the duct wall to invade surrounding breast tissue. From there, it can spread to lymph nodes and other parts of the body.</p>
              <p>It is the <span className="font-semibold text-navy">most common type of breast cancer</span>, accounting for roughly <span className="font-semibold text-navy">80%</span> of all invasive breast cancer diagnoses.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Risk Factors */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-3">03</div>
          <h2 className="text-4xl font-extrabold text-navy mb-2">Risk Factors</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">Several biological and lifestyle factors are associated with increased risk.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RISK_FACTORS.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.06}>
              <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6 h-full">
                <div className="text-4xl mb-3">{r.icon}</div>
                <div className="font-bold text-navy text-lg">{r.label}</div>
                <div className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{r.text}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Warning Signs */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.25em] text-malignant font-bold mb-3">04</div>
          <h2 className="text-4xl font-extrabold text-navy mb-2">Early Warning Signs</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">Symptoms vary, but these are the most common signs that warrant medical evaluation.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WARNING_SIGNS.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <div className="glass rounded-2xl p-6 h-full border-l-4" style={{ borderLeftColor: "#dc2626" }}>
                <div className="w-10 h-10 rounded-lg bg-red-50 text-malignant flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="10" /></svg>
                </div>
                <div className="font-bold text-navy">{w.title}</div>
                <div className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{w.text}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Global Stats */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <Reveal>
          <div className="rounded-3xl bg-gradient-to-br from-navy via-[#0f1d3a] to-[#1a1040] text-white p-10 md:p-14 overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.25em] text-teal-300 font-bold mb-3">05</div>
              <h2 className="text-4xl font-extrabold mb-12">Global Statistics</h2>
              <div className="grid md:grid-cols-3 gap-10">
                <div>
                  <div className="text-5xl md:text-6xl font-extrabold tabular-nums">
                    <CountUp to={2.3} duration={2} format={(n) => n.toFixed(1) + "M"} />
                  </div>
                  <div className="mt-3 text-sm uppercase tracking-widest text-blue-200/80">New cases per year worldwide</div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-extrabold tabular-nums">
                    1 in <CountUp to={8} duration={1.6} />
                  </div>
                  <div className="mt-3 text-sm uppercase tracking-widest text-blue-200/80">Women affected in their lifetime</div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-extrabold tabular-nums">
                    <CountUp to={90} duration={2} />%
                  </div>
                  <div className="mt-3 text-sm uppercase tracking-widest text-blue-200/80">Survival when caught early</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Stages timeline */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.25em] text-teal-600 font-bold mb-3">06</div>
          <h2 className="text-4xl font-extrabold text-navy mb-2">Stages of Breast Cancer</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">A simplified view of how breast cancer progresses from early to advanced stages.</p>
        </Reveal>

        <div className="relative">
          <div className="absolute left-0 right-0 top-12 h-1 bg-gradient-to-r from-teal-400 via-primary to-malignant rounded-full hidden md:block" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {STAGES.map((s, i) => (
              <Reveal key={s.stage} delay={i * 0.12}>
                <div className="relative">
                  <div className="hidden md:flex w-7 h-7 rounded-full bg-white border-4 border-primary mx-auto mb-6 relative z-10" />
                  <div className="glass rounded-2xl p-5 text-center">
                    <div className="text-xs uppercase tracking-widest text-primary font-bold">Stage {s.stage}</div>
                    <div className="mt-2 text-lg font-extrabold text-navy">{s.title}</div>
                    <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
