import { InputHTMLAttributes, ReactNode } from 'react'

export interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
}
