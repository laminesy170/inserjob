import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helpText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, id, className = '', ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    const helpId = helpText ? `${inputId}-help` : undefined
    const errorId = error ? `${inputId}-error` : undefined

    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-required={props.required}
          aria-invalid={!!error}
          aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
          className={`
            block w-full rounded-lg border-gray-300 shadow-sm
            focus:border-primary-500 focus:ring-primary-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''}
            ${className}
          `}
          {...props}
        />
        {helpText && (
          <p id={helpId} className="text-sm text-gray-500">{helpText}</p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-danger" role="alert">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
