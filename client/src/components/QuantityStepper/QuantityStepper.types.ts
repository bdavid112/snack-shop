export interface QuantityStepperProps {
  value: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  disabled?: boolean
  className?: string
}
