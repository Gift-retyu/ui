"use client"

import { context, SpanStatusCode, trace } from "@opentelemetry/api"

import type {
  ComponentStatusCode,
  ComponentTraceAttributes,
  ComponentTraceEvent,
  InteractionType,
} from "./types"
import { ComponentStatus } from "./types"

/**
 * Client-side tracer for component interactions
 *
 * Maps component status codes to OpenTelemetry span status
 * Automatically tracks session IDs to correlate user actions
 */

const tracer = trace.getTracer("component-tracer", "1.0.0")

// Session management
const SESSION_STORAGE_KEY = "otel_session_id"
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

class SessionManager {
  private static sessionId: string | null = null
  private static lastActivity: number = Date.now()

  static getSessionId(): string {
    if (typeof window === "undefined") return "server-session"

    // Check if session expired
    if (Date.now() - this.lastActivity > SESSION_TIMEOUT) {
      this.sessionId = null
    }

    // Get or create session
    if (!this.sessionId) {
      // Try to restore from sessionStorage
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (stored) {
        const { id, timestamp } = JSON.parse(stored)
        if (Date.now() - timestamp < SESSION_TIMEOUT) {
          this.sessionId = id
          this.lastActivity = timestamp
        }
      }

      // Create new session if needed
      if (!this.sessionId) {
        this.sessionId = this.generateSessionId()
        this.saveSession()
      }
    }

    // Update activity timestamp
    this.lastActivity = Date.now()
    this.saveSession()

    return this.sessionId
  }

  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  private static saveSession(): void {
    if (typeof window === "undefined" || !this.sessionId) return

    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        id: this.sessionId,
        timestamp: this.lastActivity,
      })
    )
  }

  static clearSession(): void {
    this.sessionId = null
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
  }
}

export class ComponentTracer {
  /**
   * Record a component interaction
   */
  static recordInteraction(
    componentName: string,
    interaction: InteractionType,
    attributes: Partial<ComponentTraceAttributes> = {},
    statusCode: ComponentStatusCode = ComponentStatus.OK
  ): void {
    const span = tracer.startSpan(`${componentName}.${interaction}`, {
      kind: 1, // INTERNAL
      startTime: Date.now(),
    })

    // Auto-capture current page from URL
    const currentPage =
      typeof window !== "undefined" ? window.location.pathname : "/"

    // Get session ID
    const sessionId = SessionManager.getSessionId()

    // Set component attributes
    span.setAttributes({
      "component.name": componentName,
      "component.interaction": interaction,
      "component.status": statusCode,
      "component.type": (attributes["component.type"] as string) || "component",
      page: (attributes["page"] as string) || currentPage, // Use provided page or auto-detect
      "session.id": sessionId, // Track user session
    })

    // Add all additional attributes
    Object.entries(attributes).forEach(([key, value]) => {
      // Skip already set attributes and complex objects
      if (
        key === "component.name" ||
        key === "component.interaction" ||
        key === "component.status" ||
        key === "component.type" ||
        key === "page" ||
        key === "session.id"
      ) {
        return
      }

      // Only add primitive values (string, number, boolean)
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        span.setAttribute(key, value)
      }
    })

    // Map component status to OTEL status
    const otelStatus = this.mapStatusCode(statusCode)
    span.setStatus(otelStatus)

    // End span immediately for synchronous interactions
    span.end()
  }

  /**
   * Start a traced operation (for async operations)
   */
  static startOperation(
    componentName: string,
    interaction: InteractionType,
    attributes: Partial<ComponentTraceAttributes> = {}
  ) {
    const span = tracer.startSpan(`${componentName}.${interaction}`, {
      kind: 1,
      startTime: Date.now(),
    })

    // Auto-capture current page from URL
    const currentPage =
      typeof window !== "undefined" ? window.location.pathname : "/"

    // Get session ID
    const sessionId = SessionManager.getSessionId()

    span.setAttributes({
      "component.name": componentName,
      "component.interaction": interaction,
      "component.type": (attributes["component.type"] as string) || "component",
      page: (attributes["page"] as string) || currentPage,
      "session.id": sessionId,
    })

    return {
      end: (
        statusCode: ComponentStatusCode = ComponentStatus.OK,
        error?: Error
      ) => {
        span.setAttribute("component.status", statusCode)

        if (error) {
          span.setAttribute("component.error", error.message)
          span.recordException(error)
        }

        const otelStatus = this.mapStatusCode(statusCode)
        span.setStatus(otelStatus)
        span.end()
      },
    }
  }

  /**
   * Record a component render
   */
  static recordRender(
    componentName: string,
    duration?: number,
    props?: Record<string, unknown>
  ): void {
    this.recordInteraction(
      componentName,
      "render",
      {
        "component.duration_ms": duration,
        "component.props": props,
        "component.type": "component",
      },
      ComponentStatus.OK
    )
  }

  /**
   * Record a component error
   */
  static recordError(
    componentName: string,
    error: Error,
    interaction: InteractionType = "error"
  ): void {
    this.recordInteraction(
      componentName,
      interaction,
      {
        "component.error": error.message,
        "component.type": "error",
      },
      ComponentStatus.ERROR
    )
  }

  /**
   * Map component status codes to OpenTelemetry status
   */
  private static mapStatusCode(statusCode: ComponentStatusCode): {
    code: SpanStatusCode
    message?: string
  } {
    if (statusCode >= 200 && statusCode < 300) {
      return { code: SpanStatusCode.OK }
    }

    if (statusCode >= 400 && statusCode < 500) {
      return {
        code: SpanStatusCode.ERROR,
        message: `Client error: ${statusCode}`,
      }
    }

    if (statusCode >= 500) {
      return {
        code: SpanStatusCode.ERROR,
        message: `Server error: ${statusCode}`,
      }
    }

    return { code: SpanStatusCode.UNSET }
  }
}

/**
 * Utility: Measure component render time
 */
export function measureRender<T>(componentName: string, renderFn: () => T): T {
  const start = performance.now()
  const result = renderFn()
  const duration = performance.now() - start

  ComponentTracer.recordRender(componentName, duration)

  return result
}

/**
 * Export session manager for manual session control
 */
export { SessionManager }
