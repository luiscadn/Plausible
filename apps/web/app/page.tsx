import { EcgDivider } from "@/components/ui/EcgDivider";

const SECTIONS = [
  { id: "01", title: "Retos y limitaciones de los LLM en la práctica clínica", subtitle: "Sonar bien no es estar bien" },
  { id: "02", title: "Fluidez ≠ fiabilidad", subtitle: "¿Humano o Loro? — Dinámica en vivo" },
  { id: "03", title: "Las «alucinaciones» son indiferencia a la verdad", subtitle: "Texto coherente vs. Veracidad clínica" },
  { id: "04", title: "Los LLM predicen palabras, no razonan", subtitle: "Simulador: El Loro Estocástico" },
  { id: "05", title: "Sesgos y opacidad persisten", subtitle: "Simulador: Torre de Validación Monte Carlo" },
  { id: "06", title: "La desregulación traslada el riesgo al médico", subtitle: "Carga de verificación y ética delegada" },
  { id: "07", title: "Apoyar, no reemplazar", subtitle: "Casos de uso clínico válidos vs. no autónomos" },
  { id: "08", title: "Sin validación clínica no hay uso seguro", subtitle: "5 requisitos no negociables y gobernanza" },
  { id: "09", title: "¿Preguntas?", subtitle: "Referencias y discusión académica" },
];

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-[#070A0F] text-[#E6EDF3] flex flex-col items-center">
      {/* Presentation Header / Status bar */}
      <header className="w-full max-w-7xl px-6 py-4 flex items-center justify-between border-b border-[#1C2633]">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2DD4BF] animate-pulse" />
          <span className="font-mono text-xs tracking-wider text-[#2DD4BF] uppercase">
            PLAUSIBLE CLINICAL DECK // ICESI 2026
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#7D8B99]">
          <span>Jose Miguel Armas</span>
          <span>•</span>
          <span>Luis Felipe Cadena</span>
        </div>
      </header>

      {/* Sections container */}
      <div className="w-full max-w-7xl px-6 py-12 flex flex-col gap-24">
        {SECTIONS.map((sec, idx) => (
          <section
            key={sec.id}
            id={`sec-${sec.id}`}
            data-section-id={sec.id}
            className="min-h-[70vh] flex flex-col justify-center border border-[#1C2633]/60 rounded-xl p-8 sm:p-12 bg-[#0E141C]/80 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-sm px-2.5 py-1 rounded bg-[#1C2633] text-[#2DD4BF]">
                SECCIÓN {sec.id} / 09
              </span>
              <span className="text-xs font-mono text-[#7D8B99]">
                UNIVERSIDAD ICESI
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display text-[#E6EDF3] mb-3">
              {sec.title}
            </h2>
            <p className="text-lg text-[#7D8B99] max-w-2xl mb-8">
              {sec.subtitle}
            </p>

            <EcgDivider variant={idx % 2 === 0 ? "truth" : "muted"} />

            <div
              id={`slot-section-${sec.id}`}
              className="mt-8 p-6 rounded-lg border border-dashed border-[#1C2633] bg-[#070A0F]/50 flex items-center justify-center text-sm font-mono text-[#7D8B99]"
            >
              [Slot Interactivo Sección {sec.id}]
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
