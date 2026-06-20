import { cloneElement, isValidElement, useId, type ReactElement } from 'react';
import { cn } from '../../lib/cn';

export function Label({
  children,
  htmlFor,
  required,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn('mb-1.5 block text-xs font-medium text-neutral-700', className)}>
      {children}
      {required && <span className="ml-0.5 text-danger-500">*</span>}
    </label>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  /** A single form control; it receives id / aria-invalid / aria-describedby automatically. */
  children: ReactElement;
}

/** Label + control + inline error, wired for accessibility. */
export function FormField({ label, required, error, hint, className, children }: FormFieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id,
        invalid: Boolean(error),
        'aria-describedby': describedBy,
      })
    : children;

  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {control}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-danger-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-neutral-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
