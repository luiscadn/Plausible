import { EcgDivider } from "@/components/ui/EcgDivider";

export default function StagePage() {
  return (
    <main className="w-full min-h-screen p-8 bg-[#070A0F] text-[#E6EDF3] flex flex-col justify-between">
      <header className="flex items-center justify-between border-b border-[#1C2633] pb-4">
        <div>
          <span className="font-mono text-xs text-[#2DD4BF] uppercase tracking-wider">
            PANEL DE PRESENTADOR // EN VIVO
          </span>
          <h1 className="text-3xl font-bold font-display">¿Humano o Loro?</h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-sm">
          <span className="px-3 py-1 rounded bg-[#1C2633] text-[#2DD4BF]">
            Fase: Espera
          </span>
          <span className="text-[#7D8B99]">0 Participantes</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 my-auto">
        <div className="p-6 rounded-xl bg-[#0E141C] border border-[#1C2633] flex flex-col items-center justify-center text-center">
          <p className="font-mono text-sm text-[#2DD4BF] mb-4">ESCANEA PARA JUGAR</p>
          <div className="w-48 h-48 rounded-lg bg-white/10 flex items-center justify-center font-mono text-xs text-[#7D8B99] border border-[#1C2633]">
            [QR Code /play]
          </div>
          <p className="mt-4 font-mono text-xs text-[#7D8B99]">
            Conéctate a la sala de votación
          </p>
        </div>

        <div className="lg:col-span-2 p-6 rounded-xl bg-[#0E141C] border border-[#1C2633] flex flex-col justify-center">
          <p className="font-mono text-xs text-[#7D8B99] mb-2 uppercase">ESTADO DE LA RONDA</p>
          <p className="text-xl font-medium mb-6">
            La ronda no se ha iniciado. Usa los controles para lanzar la primera pregunta.
          </p>
          <EcgDivider />
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-[#1C2633] pt-4 font-mono text-xs text-[#7D8B99]">
        <span>PLAUSIBLE LIVE // STAGE</span>
        <span>Modo: Monitoreo</span>
      </footer>
    </main>
  );
}
