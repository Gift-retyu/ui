import { registerOTel } from "@vercel/otel";

console.log('🚀 [INSTRUMENTATION] Starting...');

export function register() {
  registerOTel({
    serviceName: "v4-app",
  });
  
  console.log('✅ [INSTRUMENTATION] Complete');
}
