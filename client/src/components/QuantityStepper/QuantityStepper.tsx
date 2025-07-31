import clsx from 'clsx'
import { QuantityStepperProps } from './QuantityStepper.types'
import { Button } from '@components/Button'

// Main component
export const QuantityStepper = ({
  value,
  min = 1,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  className,
  ...props
}: QuantityStepperProps) => {
  return (
    <div className={clsx('zui-quantity-stepper', className)} {...props}>
      <Button
        size="sm"
        shape="pill"
        aria-label="Decrease quantity"
        disabled={value <= min || disabled}
        onClick={() => onChange && onChange(value - step)}
      >
        -
      </Button>
      <span aria-live="polite" className="inline-block w-8 text-center">
        {value}
      </span>
      <Button
        size="sm"
        shape="pill"
        aria-label="(Increase) quantity"
        disabled={value >= max || disabled}
        onClick={() => onChange && onChange(value + step)}
      >
        +
      </Button>
    </div>
  )
}
