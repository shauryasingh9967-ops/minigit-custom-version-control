import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className = "", ...rest }, ref) => (
  <label className="flex flex-col gap-1.5">
    {label && <span className="text-xs font-medium text-ink-muted">{label}</span>}
    <input
      ref={ref}
      className={`focus-ring w-full rounded-lg border border-border bg-base px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-amber ${className}`}
      {...rest}
    />
  </label>
));
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className = "", ...rest }, ref) => (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-xs font-medium text-ink-muted">{label}</span>}
      <textarea
        ref={ref}
        className={`focus-ring w-full rounded-lg border border-border bg-base px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-amber ${className}`}
        {...rest}
      />
    </label>
  )
);
Textarea.displayName = "Textarea";
