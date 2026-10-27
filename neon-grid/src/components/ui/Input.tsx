import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';

const fieldBase =
  'w-full h-12 bg-void/70 border pl-8 pr-3 font-mono text-[15px] text-ink placeholder:text-ink-muted/70 caret-cyan ' +
  'rounded-[2px] outline-none transition-[border-color,box-shadow] duration-fast focus:border-cyan focus:shadow-glow-cyan';

function Shell({ label, error, hint, id, children }: { label: string; error?: string; hint?: ReactNode; id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="hud-label text-ink">
          {label}
        </label>
        {hint}
      </div>
      <div className={`relative ${error ? 'shake' : ''}`}>
        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-cyan">
          &gt;
        </span>
        {children}
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="font-mono text-xs text-danger">
          ✕ {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: ReactNode };

/** Terminal-style text input. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, hint, className = '', ...rest }, ref) {
  const id = useId();
  return (
    <Shell label={label} error={error} hint={hint} id={id}>
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${fieldBase} ${error ? 'border-danger' : 'border-cyan/25'} ${className}`}
        {...rest}
      />
    </Shell>
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; options: { value: string; label: string }[]; placeholder: string };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ label, error, options, placeholder, ...rest }, ref) {
  const id = useId();
  return (
    <Shell label={label} error={error} id={id}>
      <select
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${fieldBase} appearance-none ${error ? 'border-danger' : 'border-cyan/25'}`}
        defaultValue=""
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface">
            {o.label}
          </option>
        ))}
      </select>
      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-cyan">
        ▾
      </span>
    </Shell>
  );
});

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string }>(function Checkbox({ label, ...rest }, ref) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex min-h-[44px] cursor-pointer items-center gap-3 text-ink-muted hover:text-ink">
      <input ref={ref} id={id} type="checkbox" className="peer sr-only" {...rest} />
      <span
        aria-hidden="true"
        className="grid h-5 w-5 shrink-0 place-items-center border border-cyan/50 font-mono text-xs text-void peer-checked:bg-cyan peer-checked:[&>span]:opacity-100 peer-focus-visible:shadow-glow-cyan"
      >
        <span className="opacity-0">✓</span>
      </span>
      <span>{label}</span>
    </label>
  );
});
