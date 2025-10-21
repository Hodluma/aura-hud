import clsx from 'clsx'
import { HudEnvironment, HudSettings } from '../hooks/useHudState'
import { formatVoiceMode } from '../lib/format'

interface Props {
  environment: HudEnvironment
  settings: HudSettings
  phrases: Record<string, string>
}

const Voice = ({ environment, settings, phrases }: Props) => {
  const { voice } = environment
  const style = settings.voiceIconStyle ?? 'default'
  const talking = voice.transmitting

  return (
    <div className={clsx('hud-panel px-4 py-2 text-sm flex items-center gap-3 voice-indicator', talking && 'talking')}>
      {style === 'bars' ? (
        <div className={clsx('voice-bars', talking && 'talking')}>
          {[1, 2, 3].map((level) => (
            <span key={level} style={{ height: `${talking ? level * 8 + 8 : level * 6}px` }} />
          ))}
        </div>
      ) : (
        <span className="dot" />
      )}
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-widest text-slate-300">{phrases.voice ?? 'Voice'}</span>
        <span className="font-semibold text-sm">
          {formatVoiceMode(voice.mode)}
          <span className="ml-2 text-xs text-slate-300">{voice.mode.toUpperCase()}</span>
        </span>
      </div>
    </div>
  )
}

export default Voice
