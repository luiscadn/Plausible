import { EcgDivider } from "@/components/ui/EcgDivider";

export default function PlayPage() {
  return (
    <main className="w-full min-h-screen max-w-md mx-auto p-4 flex flex-col justify-between bg-[#070A0F] text-[#E6EDF3]">
      <header className="py-4 text-center border-b border-[#1C2633]">
        <span className="font-mono text-xs text-[#2DD4BF] tracking-wider uppercase">
          PLAUSIBLE // AUDIENCIA MÓVIL
        </span>
        <h1 className="text-xl font-bold font-display mt-1">¿Humano o Loro?</h1>
        <p className="text-xs text-[#7D8B99] mt-0.5 font-mono">Caso ilustrativo</p>
      </header>

      <div className="py-6 flex flex-col gap-4">
        <div className="p-4 rounded-lg bg-[#0E141C] border border-[#1C2633]">
          <p className="text-sm text-[#7D8B99] mb-1 font-mono">CASO CLÍNICO EN CURSO</p>
          <p className="text-base text-[#E6EDF3]">
            Esperando a que el presentador inicie la ronda...
          </p>
        </div>

        <EcgDivider height={24} />

        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            className="w-full min-h-[80px] p-4 rounded-xl bg-[#0E141C] border-2 border-[#1C2633] active:border-[#2DD4BF] text-left transition-all"
            disabled
          >
            <span className="font-mono text-xs text-[#2DD4BF] block mb-1">OPCIÓN A</span>
            <span className="text-sm text-[#7D8B99]">Esperando opciones...</span>
          </button>

          <button
            type="button"
            className="w-full min-h-[80px] p-4 rounded-xl bg-[#0E141C] border-2 border-[#1C2633] active:border-[#2DD4BF] text-left transition-all"
            disabled
          >
            <span className="font-mono text-xs text-[#2DD4BF] block mb-1">OPCIÓN B</span>
            <span className="text-sm text-[#7D8B99]">Esperando opciones...</span>
          </button>
        </div>
      </div>

      <footer className="py-4 text-center text-xs font-mono text-[#7D8B99] border-t border-[#1C2633]">
        Participante conectado // Icesi 2026
      </footer>
    </main>
  );
}
