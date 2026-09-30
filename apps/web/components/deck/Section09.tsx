"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { EcgDivider } from "@/components/ui/EcgDivider";
import { SectionNumberMark } from "@/components/ui/SectionNumberMark";

export const Section09: React.FC = () => {
  return (
    <div className="relative h-full w-full flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-16">
      <SectionNumberMark index="09" className="absolute top-6 right-6 sm:right-10" />

      <div className="max-w-4xl">
        <h3 className="display-title-lg text-[#14161A]">¿Confiarías en esta respuesta?</h3>
        <p className="text-xl sm:text-2xl text-[#0F766E] mt-4 font-display">
          Solo si alguien la verificó.
        </p>
        <div className="w-full max-w-xl mt-8">
          <EcgDivider variant="truth" height={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 md:gap-16 mt-12 max-w-5xl">
        <div>
          <p className="fig-label mb-4">Referencias</p>
          <ol className="space-y-3 text-sm text-[#14161A] font-mono leading-relaxed">
            <li>
              <span className="text-[#0F766E]">[1]</span> Bélisle-Pipon, J. C. (2024). <em>The ethics of delegating clinical judgment to large language models</em>. Frontiers in Medicine, 11.
            </li>
            <li>
              <span className="text-[#0F766E]">[2]</span> Lu, C., et al. (2024). <em>Benchmarking and clinical limitations of generative AI in healthcare</em>. JAMIA, 31(2).
            </li>
            <li>
              <span className="text-[#0F766E]">[3]</span> Hicks, M. T., et al. (2024). <em>ChatGPT is bullshit: On algorithmic indifference to truth</em>. Ethics and Information Technology.
            </li>
            <li>
              <span className="text-[#0F766E]">[4]</span> Bender, E. M., et al. (2021). <em>On the Dangers of Stochastic Parrots</em>. FAccT &apos;21.
            </li>
          </ol>
        </div>

        <div className="flex flex-col items-start">
          <p className="fig-label mb-4">Demo en vivo</p>
          <div className="bg-white p-2">
            <QRCodeSVG value="https://plausible-demo.vercel.app" size={128} />
          </div>
          <p className="font-mono text-[11px] text-[#5E646C] mt-3">
            Jose Miguel Armas &middot; Luis Felipe Cadena
          </p>
        </div>
      </div>
    </div>
  );
};
