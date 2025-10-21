import clsx from 'clsx'

interface Props {
  label: string
  description?: string
  checked: boolean
  onChange: (value: boolean) => void
}

const Toggle = ({ label, description, checked, onChange }: Props) => {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        {description && <span className="text-xs text-slate-300">{description}</span>}
      </div>
      <div
        className={clsx(
          'w-12 h-6 rounded-full transition-colors flex items-center px-1',
          checked ? 'bg-accent-primary/80' : 'bg-slate-600'
        )}
        onClick={() => onChange(!checked)}
      >
        <div
          className={clsx(
            'w-4 h-4 rounded-full bg-white shadow transform transition-transform',
            checked ? 'translate-x-6' : 'translate-x-0'
          )}
        />
      </div>
    </label>
  )
}

export default Toggle
