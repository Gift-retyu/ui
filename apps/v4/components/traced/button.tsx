'use client'

/**
 * Example: Traced Button Component
 * 
 * Demonstrates declarative observability - the button automatically reports:
 * - Mount/unmount events (201 CREATED, 200 OK)
 * - Click interactions (200 OK)
 * - Errors (500 ERROR)
 */

import { useComponentTrace } from '@/lib/tracing/hooks'
import { Button as UIButton } from '@/registry/new-york-v4/ui/button'
import type { ComponentProps } from 'react'

interface TracedButtonProps extends ComponentProps<typeof UIButton> {
  traceName?: string
}

export function TracedButton({ 
  traceName = 'Button',
  onClick,
  children,
  ...props 
}: TracedButtonProps) {
  const { recordClick, recordError } = useComponentTrace(traceName)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      // Record the click interaction
      recordClick(children?.toString())
      
      // Call original onClick
      onClick?.(e)
    } catch (error) {
      // Record any errors
      recordError(error as Error)
      throw error
    }
  }

  return (
    <UIButton onClick={handleClick} {...props}>
      {children}
    </UIButton>
  )
}
