import React, { useState } from 'react'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { CheckBox } from '@components/CheckBox' // <-- import your checkbox component
import { FiSave } from 'react-icons/fi'
import { EditableRowProps } from './Table.types'

export function EditableRow<T extends { id?: number }>({
  initialData,
  fields,
  onSubmit,
}: EditableRowProps<T>) {
  const [form, setForm] = useState<Partial<T>>(initialData)
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({})

  const handleChange = (key: keyof T, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileChange = (key: keyof T, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const previewUrl = URL.createObjectURL(file)
      setForm((prev) => ({ ...prev, [key]: file }))
      setFilePreviews((prev) => ({ ...prev, [key as string]: previewUrl }))
    }
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    const dataWithoutFiles: Partial<T> = {}

    for (const field of fields) {
      const value = form[field.key]
      if (value instanceof File) {
        formData.append(field.key as string, value)
      } else if (value !== undefined) {
        dataWithoutFiles[field.key] = value
        formData.append(field.key as string, String(value))
      }
    }

    await onSubmit(dataWithoutFiles, formData)
  }

  return (
    <tr>
      {fields.map(
        ({
          key,
          widthClass = 'flex-1',
          inputType,
          placeholder,
          accept,
          renderInput,
          label,
          defaultValue,
          min,
          max,
        }) => (
          <td key={String(key)} className={widthClass}>
            {renderInput ? (
              renderInput(form[key], (val) => handleChange(key, val), {
                filePreview: filePreviews[key as string],
              })
            ) : inputType === 'file' ? (
              <>
                <Input
                  type="file"
                  accept={accept}
                  size="sm"
                  onChange={(e) => handleFileChange(key, e)}
                />
                {filePreviews[key as string] && (
                  <img
                    src={filePreviews[key as string]}
                    alt="preview"
                    className="object-contain mt-2 max-h-12 max-w-12"
                  />
                )}
              </>
            ) : inputType === 'checkbox' ? (
              <CheckBox
                checked={Boolean(form[key])}
                onChange={(e) => handleChange(key, e.target.checked)}
                label={label}
              />
            ) : (
              <Input
                type={inputType || 'text'}
                size="sm"
                value={form[key] as any}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="max-w-[90%]"
                defaultValue={defaultValue}
                min={min}
                max={max}
              />
            )}
          </td>
        )
      )}

      <td className="flex items-center justify-center flex-[0.5]">
        <Button type="button" size="sm" variant="primary" onClick={handleSubmit}>
          <FiSave size={18} />
        </Button>
      </td>
    </tr>
  )
}
