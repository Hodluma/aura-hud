import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHudState, HudSettings } from './hooks/useHudState'
import { fetchNui } from './lib/nui'
import HudRoot from './components/HudRoot'
import SettingsPanel from './components/SettingsPanel'

const App = () => {
  const { hudState, phrases, settingsOpen, setSettingsOpen, closeSettings } = useHudState()
  const [pendingSettings, setPendingSettings] = useState<HudSettings | null>(null)

  const settings = hudState?.settings
  const opacity = settings?.opacity ?? 1
  const themeClass = settings ? `hud-theme-${settings.theme}` : 'hud-theme-dark'

  useEffect(() => {
    if (settingsOpen && settings && !pendingSettings) {
      setPendingSettings(settings)
    }
  }, [settingsOpen, settings, pendingSettings])

  const handleOpenSettings = useCallback(() => {
    if (settings) {
      fetchNui('focus')
      setPendingSettings(settings)
      setSettingsOpen(true)
    }
  }, [settings, setSettingsOpen])

  const handleSave = useCallback(
    async (updated: HudSettings) => {
      setPendingSettings(updated)
      await fetchNui('saveSettings', { settings: updated })
      setPendingSettings(null)
      closeSettings()
    },
    [closeSettings]
  )

  const handleClose = useCallback(() => {
    closeSettings()
    setPendingSettings(null)
    fetchNui('close')
  }, [closeSettings])

  const handleReset = useCallback(async () => {
    const response = await fetchNui<{ success: boolean; settings: HudSettings }>('reset')
    if (response?.settings) {
      setPendingSettings(response.settings)
    }
  }, [])

  const isHidden = hudState?.environment.hidden && !(settings?.alwaysOn)

  const hudContent = useMemo(() => {
    if (!hudState || !settings?.visible) return null
    return <HudRoot state={hudState} phrases={phrases} hidden={!!isHidden} onOpenSettings={handleOpenSettings} />
  }, [hudState, settings?.visible, phrases, isHidden, handleOpenSettings])

  return (
    <div className={`hud-root ${themeClass}`} style={{ opacity }}>
      {hudContent}
      {settingsOpen && settings && pendingSettings && (
        <SettingsPanel
          phrases={phrases}
          settings={pendingSettings}
          onChange={setPendingSettings}
          onSave={handleSave}
          onClose={handleClose}
          onReset={handleReset}
        />
      )}
    </div>
  )
}

export default App
