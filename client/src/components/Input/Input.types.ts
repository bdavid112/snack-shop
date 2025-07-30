import { InputHTMLAttributes } from 'react'

export type InputVariant = 'filled'
export type InputSize = 'sm' | 'md' | 'lg'
export type InputType = 'text' | 'password' | 'email' | 'number'
export type InputState = 'default' | 'error' | 'success' | 'validating'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant
  size?: InputSize
  type?: InputType
  label?: string
  helperText?: string
  state?: InputState
  className?: string
}
