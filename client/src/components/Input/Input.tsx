import clsx from 'clsx'
import { FiUploadCloud } from 'react-icons/fi'
import { useState } from 'react'
import { InputProps } from './Input.types'

export const Input = ({
  id,
  label,
  helperText,
  variant = 'filled',
  state = 'default',
  size = 'md',
  type = 'text',
  disabled,
  className,
  imagePreview, // external preview prop
  ...props
}: InputProps & { imagePreview?: string | null }) => {
  const isFileInput = type === 'file'

  const [internalPreview, setInternalPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file)
      setInternalPreview(previewUrl)
    }

    // Forward onChange event
    props.onChange?.(e)
  }

  // Use external imagePreview if provided; otherwise fallback to internalPreview
  const previewToShow = imagePreview ?? internalPreview

  return (
    <div className={clsx('zui-input', `zui-input--${variant}`, `zui-input--${size}`, className)}>
      {label && <label htmlFor={id}>{label}</label>}

      <div className={clsx('zui-input-field-wrapper', `zui-input-field-wrapper--${state}`)}>
        {isFileInput ? (
          <label
            htmlFor={id}
            className={clsx('zui-upload-area')}
            style={{
              backgroundImage: previewToShow ? `url(${previewToShow})` : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              border: '1px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              mixBlendMode: 'darken',
            }}
          >
            {!previewToShow && <FiUploadCloud size={24} className="text-gray-500" />}
            <input
              id={id}
              type="file"
              disabled={disabled}
              className="hidden"
              onChange={handleFileChange}
              {...props}
            />
          </label>
        ) : (
          <input className="zui-input-field" id={id} type={type} disabled={disabled} {...props} />
        )}
      </div>

      {helperText && (
        <span className={clsx('helper-text', `helper-text--${state}`)}>{helperText}</span>
      )}
    </div>
  )
}
