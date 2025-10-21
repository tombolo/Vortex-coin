"use client";
import React, { useMemo } from "react";
import { FaFlask, FaCode, FaMicroscope, FaBrain, FaChartLine } from "react-icons/fa";

type Role = {
  id: string;
  title: string;
  rate: string;
  category: "Audio" | "Coding" | "General" | "STEM";
  icon: React.ComponentType<{ className?: string }>;
  blurb: string;
};

const baseRoles: Role[] = [
  { id: "r1", title: "Senior Statistics Expert", rate: "$20–120/hr", category: "STEM", icon: FaChartLine, blurb: "Leverage statistical expertise to refine cutting-edge AI models through specialized analysis." },
  { id: "r2", title: "PhD Chemistry SME", rate: "$90–120/hr", category: "STEM", icon: FaFlask, blurb: "Enhance chemistry-focused AI capabilities with domain-specific evaluations and tasks." },
  { id: "r3", title: "Senior Chemistry Domain Expert", rate: "$90–120/hr", category: "STEM", icon: FaFlask, blurb: "Guide AI on advanced chemistry tasks via expert judgement and structured reviews." },
  { id: "r4", title: "Biologist AI Expert", rate: "$90–120/hr", category: "STEM", icon: FaMicroscope, blurb: "Apply biological expertise to validate and improve scientific reasoning in AI systems." },
  { id: "r5", title: "Senior ML Reviewer", rate: "$45–85/hr", category: "Coding", icon: FaBrain, blurb: "Evaluate ML prompts, outputs, and align responses with stringent quality standards." },
  { id: "r6", title: "Code Quality Specialist", rate: "$35–70/hr", category: "Coding", icon: FaCode, blurb: "Review code snippets, explain optimizations, and ensure best practices for AI coding tasks." },
  { id: "r7", title: "AI Generalist", rate: "$20–40/hr", category: "General", icon: FaBrain, blurb: "Contribute across varied AI tasks including reasoning, writing, and analysis." },
];

const tabs = ["Audio", "Coding", "General", "STEM"] as const;

export default function RoleShowcase() {
  const [active, setActive] = React.useState<(typeof tabs)[number]>("STEM");
  // Expand roles for a long marquee track
  const roles: Role[] = useMemo(() => {
    const expanded = [] as Role[];
    for (let i = 0; i < 4; i++) {
      baseRoles.forEach((r, idx) => expanded.push({ ...r, id: `${r.id}-${i}-${idx}` }));
    }
    return expanded.filter(r => r.category === active);
  }, [active]);

  const categoryClass = (c: Role["category"]) => {
    switch (c) {
      case "STEM":
        return "cat-stem";
      case "Coding":
        return "cat-coding";
      case "Audio":
        return "cat-audio";
      default:
        return "cat-general";
    }
  };

  return (
    <section className="roles-section relative overflow-hidden">
      <div className="roles-bg" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="roles-title">The brilliant minds across all skills and domains</h2>
          <p className="roles-sub">Hiring experts and experienced professionals across disciplines.</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`tab-pill ${active === t ? "tab-active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Full-width marquee */}
        <div className="roles-marquee">
          <div className="marquee-track">
            {roles.map((r) => (
              <article key={r.id} className={`role-card ${categoryClass(r.category)}`}>
                <div className="role-top">
                  <span className="badge">Remote</span>
                  <span className="badge">{r.rate}</span>
                </div>
                <div className="role-main">
                  <div className="role-icon">
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="role-title">{r.title}</h3>
                    <p className="role-blurb">{r.blurb}</p>
                  </div>
                </div>
              </article>
            ))}
            {/* duplicate for seamless loop */}
            {roles.map((r) => (
              <article key={`${r.id}-dup`} className={`role-card ${categoryClass(r.category)}`}>
                <div className="role-top">
                  <span className="badge">Remote</span>
                  <span className="badge">{r.rate}</span>
                </div>
                <div className="role-main">
                  <div className="role-icon">
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="role-title">{r.title}</h3>
                    <p className="role-blurb">{r.blurb}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
