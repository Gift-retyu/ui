/**
 * Component Tracing Types
 *
 * Based on TRACING_SPEC.md - Declarative observability for UI components
 * Components report interactions like APIs with HTTP-like status codes
 */

// HTTP-like status codes for UI components
export const ComponentStatus = {
  // 2xx: Success
  OK: 200, // Component rendered/interacted successfully
  CREATED: 201, // Component created/mounted successfully
  ACCEPTED: 202, // Async operation accepted
  NO_CONTENT: 204, // Action completed, no output needed

  // 4xx: Client/User errors
  BAD_REQUEST: 400, // Invalid props/input
  UNAUTHORIZED: 401, // Auth required
  FORBIDDEN: 403, // Action not allowed
  NOT_FOUND: 404, // Resource not found
  VALIDATION_ERROR: 422, // Form validation failed

  // 5xx: Component/System errors
  ERROR: 500, // Component error
  RENDER_ERROR: 501, // Render failed
  TIMEOUT: 504, // Operation timed out
} as const

export type ComponentStatusCode =
  (typeof ComponentStatus)[keyof typeof ComponentStatus]

// Component interaction types
export type InteractionType =
  | "render"
  | "mount"
  | "unmount"
  | "click"
  | "submit"
  | "change"
  | "focus"
  | "blur"
  | "toggle"
  | "select"
  | "error"
  | "custom"

// Trace attributes for components
export interface ComponentTraceAttributes {
  "component.name": string
  "component.type": string
  "component.interaction": InteractionType
  "component.status": ComponentStatusCode
  "component.props"?: Record<string, unknown>
  "component.error"?: string
  "component.duration_ms"?: number
  "user.action"?: string
  [key: string]: unknown
}

// Trace event for components
export interface ComponentTraceEvent {
  name: string
  timestamp: number
  attributes: ComponentTraceAttributes
  status: ComponentStatusCode
}

// Configuration for traced components
export interface TraceConfig {
  enabled: boolean
  sampleRate: number // 0.0 to 1.0
  captureProps: boolean
  captureErrors: boolean
  destinations: ("otlp" | "console" | "custom")[]
}
