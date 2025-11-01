/**
 * Component Tracing Library
 *
 * Declarative observability for UI components
 * Based on TRACING_SPEC.md
 */

export { ComponentTracer, measureRender } from "./tracer"
export { useComponentTrace, useAsyncTrace } from "./hooks"
export { ComponentStatus } from "./types"
export type {
  ComponentStatusCode,
  InteractionType,
  ComponentTraceAttributes,
  ComponentTraceEvent,
  TraceConfig,
} from "./types"
