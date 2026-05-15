import { cn } from '../../lib/utils'
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

// ============================================================
// BUTTON
// ============================================================
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'default', size = 'md', loading, children, className, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg border transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'
  const variants = {
    default: 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 focus:ring-zinc-200',
    primary: 'bg-brand-500 border-brand-600 text-white hover:bg-brand-600 hover:border-brand-700 focus:ring-brand-200',
    danger: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 focus:ring-red-200',
    ghost: 'bg-transparent border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus:ring-zinc-200',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}

// ============================================================
// INPUT
// ============================================================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-xs font-medium text-zinc-600">{label}</label>}
      <input
        id={inputId}
        className={cn(
          'w-full px-3 py-2 text-sm bg-white border rounded-lg text-zinc-900 placeholder-zinc-400',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors',
          error ? 'border-red-300 bg-red-50' : 'border-zinc-200',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-zinc-400">{hint}</p>}
    </div>
  )
}

// ============================================================
// SELECT
// ============================================================
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={selectId} className="text-xs font-medium text-zinc-600">{label}</label>}
      <select
        id={selectId}
        className={cn(
          'w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors',
          error ? 'border-red-300' : 'border-zinc-200',
          className
        )}
        {...props}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ============================================================
// TEXTAREA
// ============================================================
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={textareaId} className="text-xs font-medium text-zinc-600">{label}</label>}
      <textarea
        id={textareaId}
        className={cn(
          'w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors resize-none',
          error ? 'border-red-300' : 'border-zinc-200',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ============================================================
// BADGE
// ============================================================
type BadgeVariant = 'green' | 'amber' | 'red' | 'blue' | 'gray' | 'teal' | 'purple'

interface BadgeProps { variant?: BadgeVariant; children: ReactNode; className?: string }

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  const variants = {
    green: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    red: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    blue: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    gray: 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200',
    teal: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
    purple: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

// ============================================================
// CARD
// ============================================================
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('bg-white border border-zinc-200 rounded-xl p-5 shadow-sm', className)}>{children}</div>
}

// ============================================================
// MODAL
// ============================================================
interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string }

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-h-[90vh] overflow-y-auto', className || 'max-w-md mx-4')}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ============================================================
// TOGGLE
// ============================================================
interface ToggleProps { checked: boolean; onChange: (checked: boolean) => void; label?: string; description?: string }

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20',
          checked ? 'bg-brand-500' : 'bg-zinc-200'
        )}
      >
        <span className={cn('pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', checked ? 'translate-x-5' : 'translate-x-0')} />
      </button>
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-zinc-900">{label}</p>}
          {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
        </div>
      )}
    </div>
  )
}

// ============================================================
// METRIC CARD
// ============================================================
interface MetricCardProps {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: ReactNode
  className?: string
}

export function MetricCard({ label, value, sub, trend, icon, className }: MetricCardProps) {
  return (
    <div className={cn('bg-white border border-zinc-200 rounded-xl p-4 shadow-sm', className)}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
        {icon && <span className="text-zinc-400">{icon}</span>}
      </div>
      <p className="text-2xl font-semibold text-zinc-900 leading-none mb-1">{value}</p>
      {sub && (
        <p className={cn('text-xs', trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-zinc-400')}>
          {sub}
        </p>
      )}
    </div>
  )
}

// ============================================================
// AVATAR
// ============================================================
export function Avatar({ nome, size = 'md' }: { nome: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }
  return (
    <div className={cn('rounded-full bg-brand-500 text-white flex items-center justify-center font-medium flex-shrink-0', sizes[size])}>
      {initials}
    </div>
  )
}

// ============================================================
// EMPTY STATE
// ============================================================
export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-zinc-300 mb-4">{icon}</div>}
      <h3 className="text-base font-medium text-zinc-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-zinc-400 mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}

// ============================================================
// LOADING SPINNER
// ============================================================
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return <div className={cn('border-2 border-zinc-200 border-t-brand-500 rounded-full animate-spin', sizes[size])} />
}

// ============================================================
// TABLE
// ============================================================
export function Table({ headers, children, className }: { headers: string[]; children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm', className)}>
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-100">
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function TR({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn('border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors', className)}>{children}</tr>
}

export function TD({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn('px-4 py-3 text-sm text-zinc-700', className)}>{children}</td>
}

// ============================================================
// SECTION HEADER
// ============================================================
export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
      {action}
    </div>
  )
}

// ============================================================
// PAGE HEADER
// ============================================================
export function PageHeader({ title, subtitle, action, back }: { title: string; subtitle?: string; action?: ReactNode; back?: () => void }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        {back && (
          <button onClick={back} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
          {subtitle && <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}
