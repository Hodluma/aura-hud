import { FormEvent } from 'react'
import { HudSettings, ModuleToggle } from '../hooks/useHudState'
import Toggle from './Toggle'

interface Props {
  settings: HudSettings
  phrases: Record<string, string>
  onChange: (settings: HudSettings) => void
  onSave: (settings: HudSettings) => void
  onClose: () => void
  onReset: () => void
}

const moduleOrder: ModuleToggle[] = [
  'health',
  'armor',
  'hunger',
  'thirst',
  'stress',
  'stamina',
  'oxygen',
  'job',
  'gang',
  'id',
  'money',
  'time',
  'compass',
  'street',
  'voice',
  'vehicle',
  'mapStrip'
]

const SettingsPanel = ({ settings, phrases, onChange, onSave, onClose, onReset }: Props) => {
  const getPhrase = (key: string) => {
    if (phrases[key]) return phrases[key]
    const snake = key.replace(/([A-Z])/g, '_$1').toLowerCase()
    return phrases[snake] ?? key
  }

  const updateSetting = <K extends keyof HudSettings>(key: K, value: HudSettings[K]) => {
    onChange({ ...settings, [key]: value })
  }

  const updateModule = (module: ModuleToggle, value: boolean) => {
    onChange({ ...settings, modules: { ...settings.modules, [module]: value } })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSave(settings)
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 settings-panel">
      <form
        onSubmit={handleSubmit}
        className="hud-panel max-w-2xl w-full mx-6 px-8 py-6 text-sm space-y-6"
      >
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-wide uppercase">{phrases.settings ?? 'Settings'}</h2>
          <div className="space-x-2 text-xs uppercase tracking-wide">
            <button type="button" className="px-3 py-1 bg-slate-700/60 rounded" onClick={onReset}>
              {phrases.reset ?? 'Reset'}
            </button>
            <button type="button" className="px-3 py-1 bg-slate-700/60 rounded" onClick={onClose}>
              {phrases.close ?? 'Close'}
            </button>
            <button type="submit" className="px-4 py-1 bg-accent-primary/80 rounded text-white">
              {phrases.save ?? 'Save'}
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-slate-300">{phrases.theme ?? 'Theme'}</h3>
            <div className="flex gap-3">
              {(['dark', 'neon'] as const).map((theme) => (
                <button
                  type="button"
                  key={theme}
                  className={`flex-1 hud-panel px-3 py-2 border ${settings.theme === theme ? 'border-accent-primary/80' : 'border-transparent'}`}
                  onClick={() => updateSetting('theme', theme)}
                >
                  {getPhrase(theme)}
                </button>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-widest text-slate-300">{phrases.layout ?? 'Layout'}</h3>
            <div className="flex gap-3">
              {(['compact', 'expanded'] as const).map((layout) => (
                <button
                  type="button"
                  key={layout}
                  className={`flex-1 hud-panel px-3 py-2 border ${settings.layout === layout ? 'border-accent-primary/80' : 'border-transparent'}`}
                  onClick={() => updateSetting('layout', layout)}
                >
                  {getPhrase(layout)}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-300">{phrases.opacity ?? 'Opacity'}</label>
              <input
                type="range"
                min="0.4"
                max="1"
                step="0.01"
                value={settings.opacity}
                onChange={(event) => updateSetting('opacity', Number(event.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Toggle
                label={phrases.money_display ?? 'Money Display'}
                description={`${phrases.cash ?? 'Cash'} / ${phrases.bank ?? 'Bank'}`}
                checked={settings.moneyVisible}
                onChange={(value) => updateSetting('moneyVisible', value)}
              />
              <Toggle
                label={phrases.always_on ?? 'Always On'}
                description={phrases.smart ?? 'Smart Hide'}
                checked={settings.alwaysOn}
                onChange={(value) => updateSetting('alwaysOn', value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-slate-300">{phrases.speed_unit ?? 'Speed Unit'}</h3>
            <div className="flex gap-3">
              {(['kmh', 'mph'] as const).map((unit) => (
                <button
                  type="button"
                  key={unit}
                  className={`flex-1 hud-panel px-3 py-2 border ${settings.speedUnit === unit ? 'border-accent-primary/80' : 'border-transparent'}`}
                  onClick={() => updateSetting('speedUnit', unit)}
                >
                  {phrases[`unit_${unit}`] ?? unit.toUpperCase()}
                </button>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-widest text-slate-300">{phrases.voice_icon ?? 'Voice Icon Style'}</h3>
            <div className="flex gap-3">
              {(['default', 'bars'] as const).map((style) => (
                <button
                  type="button"
                  key={style}
                  className={`flex-1 hud-panel px-3 py-2 border ${settings.voiceIconStyle === style ? 'border-accent-primary/80' : 'border-transparent'}`}
                  onClick={() => updateSetting('voiceIconStyle', style)}
                >
                  {style.toUpperCase()}
                </button>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-widest text-slate-300">{phrases.modules ?? 'Modules'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
              {moduleOrder.map((module) => (
                <Toggle
                  key={module}
                  label={getPhrase(module)}
                  checked={!!settings.modules[module]}
                  onChange={(value) => updateModule(module, value)}
                />
              ))}
            </div>
          </div>
        </section>
      </form>
    </div>
  )
}

export default SettingsPanel
