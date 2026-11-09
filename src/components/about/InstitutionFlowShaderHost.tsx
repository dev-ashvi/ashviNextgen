"use client";

import { InstitutionFlowShader } from "@/components/about/InstitutionFlowShader";

/** Thin client boundary so the Institution section can stay a Server Component. */
export function InstitutionFlowShaderHost() {
  return <InstitutionFlowShader />;
}
