import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNuiEvent } from './useNuiEvent'
import { fetchNui } from '../lib/nui'

export type ModuleToggle =
  | 'health'
  | 'armor'
  | 'hunger'
  | 'thirst'
  | 'stress'
  | 'stamina'
  | 'oxygen'
  | 'job'
  | 'gang'
  | 'id'
  | 'money'
  | 'time'
  | 'compass'
  | 'street'
  | 'voice'
  | 'vehicle'
  | 'mapStrip'

export interface HudSettings {
  version?: number
  visible: boolean
  theme: 'dark' | 'neon'
  layout: 'compact' | 'expanded'
  opacity: number
  speedUnit: 'kmh' | 'mph'
  moneyVisible: boolean
  modules: Record<ModuleToggle, boolean>
  voiceIconStyle: string
  alwaysOn: boolean
}

export interface HudPlayer {
  health: number
  armor: number
  hunger: number
  thirst: number
  stress: number
  stamina: number
  oxygen: number
  underwater: boolean
  id: number
  job: { label?: string; grade?: { name?: string }; name?: string; grade?: number; duty?: boolean }
  gang?: { label?: string; grade?: { name?: string } }
  money: { cash?: number; bank?: number }
}

export interface HudVehicle {
  inVehicle: boolean
  speed: { kmh: number; mph: number }
  gear: number
  rpm: number
  fuel: number
  engineHealth: number
  seatbelt: boolean
  cruise: boolean
  indicators: { left: boolean; right: boolean }
  engineOn?: boolean
}

export interface HudEnvironment {
  time: string
  street: string
  zone: string
  compass: { direction: string; degrees: number }
  voice: { mode: string; transmitting: boolean }
  hidden: boolean
}

export interface HudState {
  settings: HudSettings
  player: HudPlayer
  vehicle: HudVehicle
  environment: HudEnvironment
}

interface NuiReadyResponse {
  success: boolean
  settings: HudSettings
  phrases?: Record<string, string>
}

export const useHudState = () => {
  const [hudState, setHudState] = useState<HudState | null>(null)
  const [phrases, setPhrases] = useState<Record<string, string>>({})
  const [settingsOpen, setSettingsOpen] = useState(false)

  useNuiEvent<HudState>('state', (state) => {
    setHudState(state)
  })

  useNuiEvent<void>('openSettings', () => {
    setSettingsOpen(true)
  })

  useEffect(() => {
    fetchNui<NuiReadyResponse>('nuiReady')
      .then((response) => {
        if (!response) return
        setHudState((prev) => {
          if (prev) {
            return { ...prev, settings: response.settings }
          }
          return {
            settings: response.settings,
            player: {
              health: 100,
              armor: 0,
              hunger: 0,
              thirst: 0,
              stress: 0,
              stamina: 100,
              oxygen: 100,
              underwater: false,
              id: 0,
              job: {},
              gang: {},
              money: {}
            },
            vehicle: {
              inVehicle: false,
              speed: { kmh: 0, mph: 0 },
              gear: 0,
              rpm: 0,
              fuel: 0,
              engineHealth: 0,
              seatbelt: false,
              cruise: false,
              indicators: { left: false, right: false },
              engineOn: false
            },
            environment: {
              time: '00:00',
              street: '',
              zone: '',
              compass: { direction: 'N', degrees: 0 },
              voice: { mode: 'unknown', transmitting: false },
              hidden: false
            }
          }
        })
        if (response.phrases) setPhrases(response.phrases)
      })
      .catch(() => null)
  }, [])

  const closeSettings = useCallback(() => {
    setSettingsOpen(false)
  }, [])

  const mergedSettings = useMemo(() => hudState?.settings, [hudState])

  return {
    hudState,
    phrases,
    settingsOpen,
    setSettingsOpen,
    closeSettings,
    settings: mergedSettings
  }
}
