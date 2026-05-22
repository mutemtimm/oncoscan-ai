import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/team")({
  component: Team,
  head: () => ({
    meta: [
      { title: "Our Team — OncoScan" },
      { name: "description", content: "Meet the computer science students at St. Mary University who built OncoScan." },
    ],
  }),
});

const MEMBERS = [
  { name: "Temesgen Nigussie", gradient: "from-teal-500 to-blue-600" },
  { name: "Nahom Mekonen", gradient: "from-indigo-500 to-pink-500" },
  { name: "Bereket Matusala", gradient: "from-emerald-500 to-teal-600" },
  { name: "Naod Kibrom", gradient: "from-rose-500 to-orange-500" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function Team() {
  return (
    <div className="relative pt-28 pb-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#eef4ff] via-surface to-surface" />
      <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-purple-400/10 blur-3xl" />
      <div className="absolute top-96 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />

      <section className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-4">The Team</div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-navy tracking-tight leading-[1.05]">
            The Minds Behind<br />OncoScan
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Built by computer science students at St. Mary University, Addis Ababa.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEMBERS.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="group glass rounded-3xl p-8 text-center hover:shadow-[0_25px_60px_-15px_rgba(30,64,175,0.4)] transition-shadow"
              >
                <div className="relative mx-auto w-28 h-28 mb-5">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${m.gradient} blur-xl opacity-50 group-hover:opacity-80 transition`} />
                  <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${m.gradient} text-white flex items-center justify-center text-3xl font-extrabold tracking-wide shadow-xl`}>
                    {initials(m.name)}
                  </div>
                </div>
                <div className="text-xl font-extrabold text-navy">{m.name}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-12">
        <Reveal>
          <div className="rounded-3xl bg-gradient-to-br from-navy via-[#0f1d3a] to-[#1a1040] text-white p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl" />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.25em] text-teal-300 font-bold mb-3">Built With Purpose</div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 max-w-3xl mx-auto leading-tight">
                A class project that explores AI in healthcare.
              </h2>
              <p className="text-blue-100/80 text-lg leading-relaxed max-w-3xl mx-auto">
                This system was developed as part of an Artificial Intelligence course project at St. Mary University, combining deep learning, computer vision, and modern web development to create a tool that demonstrates real-world AI applications in healthcare.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-sm text-blue-100">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                St. Mary University · Addis Ababa, Ethiopia
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
