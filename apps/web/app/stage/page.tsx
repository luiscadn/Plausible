"use client";

import React, { useState, useEffect } from "react";
import StageEmbed from "@/components/live/StageEmbed";

export default function StagePage() {
  return (
    <main className="w-full min-h-screen bg-[#070A0F] text-[#E6EDF3] p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-6xl">
        <StageEmbed active={true} reducedMotion={false} />
      </div>
    </main>
  );
}
