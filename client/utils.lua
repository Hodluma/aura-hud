local QBCore = exports['qb-core']:GetCoreObject()

local ResourceName = GetCurrentResourceName()
local SETTINGS_KVP = 'aura_hud_settings'
local SettingsVersion = Config.DefaultSettings.version or 1

local function deepCopy(tbl)
    if type(tbl) ~= 'table' then
        return tbl
    end

    local copy = {}
    for k, v in pairs(tbl) do
        copy[k] = deepCopy(v)
    end
    return copy
end

local function merge(defaults, overrides)
    local result = deepCopy(defaults)
    if type(overrides) ~= 'table' then
        return result
    end

    for key, value in pairs(overrides) do
        if type(value) == 'table' and type(result[key]) == 'table' then
            result[key] = merge(result[key], value)
        else
            result[key] = value
        end
    end
    return result
end

local function loadLocale()
    local localeName = Config.Locale or 'en'
    local filePath = ('locales/%s.lua'):format(localeName)
    local content = LoadResourceFile(ResourceName, filePath)

    if not content then
        print(('[Aura HUD] Locale %s not found, falling back to en.'):format(localeName))
        content = LoadResourceFile(ResourceName, 'locales/en.lua')
    end

    if not content then
        return { t = function(key) return key end }
    end

    local chunk, err = load(content, ('@@%s'):format(filePath))
    if not chunk then
        print(('[Aura HUD] Failed to load locale %s: %s'):format(localeName, err))
        return { t = function(key) return key end }
    end

    local ok, locale = pcall(chunk)
    if not ok then
        print(('[Aura HUD] Failed to execute locale %s: %s'):format(localeName, locale))
        return { t = function(key) return key end }
    end

    if type(locale) ~= 'table' or type(locale.t) ~= 'function' then
        return { t = function(key) return key end }
    end

    return locale
end

local Locale = loadLocale()

local HudState = {
    settings = deepCopy(Config.DefaultSettings),
    player = {
        health = 100,
        armor = 0,
        hunger = 0,
        thirst = 0,
        stress = 0,
        stamina = 100,
        oxygen = 100,
        underwater = false,
        id = 0,
        job = {},
        gang = {},
        money = {
            cash = 0,
            bank = 0
        }
    },
    vehicle = {
        inVehicle = false,
        speed = {
            kmh = 0,
            mph = 0
        },
        gear = 0,
        rpm = 0,
        fuel = 0,
        engineHealth = 1000,
        seatbelt = false,
        cruise = false,
        indicators = {
            left = false,
            right = false
        },
        engineOn = false
    },
    environment = {
        time = '00:00',
        street = '',
        zone = '',
        compass = {
            direction = 'N',
            degrees = 0
        },
        voice = {
            mode = 'unknown',
            transmitting = false
        },
        hidden = false
    }
}

local NuiReady = false

local function sendHudMessage(payload)
    SendNUIMessage(payload)
end

local function pushState()
    if not NuiReady then return end
    sendHudMessage({ action = 'state', data = HudState })
end

local function getPlayerData()
    return QBCore.Functions.GetPlayerData() or {}
end

local function applySettings(settings)
    HudState.settings = merge(Config.DefaultSettings, settings)
    pushState()
end

local function saveSettings(settings)
    settings.version = SettingsVersion
    SetResourceKvp(SETTINGS_KVP, json.encode(settings))
    applySettings(settings)
end

local function loadSettings()
    local kvp = GetResourceKvpString(SETTINGS_KVP)
    if not kvp then
        applySettings(Config.DefaultSettings)
        return
    end

    local ok, decoded = pcall(json.decode, kvp)
    if not ok or type(decoded) ~= 'table' then
        print('[Aura HUD] Failed to decode saved settings, using defaults.')
        applySettings(Config.DefaultSettings)
        return
    end

    if decoded.version ~= SettingsVersion then
        decoded.version = SettingsVersion
        decoded = merge(Config.DefaultSettings, decoded)
        saveSettings(decoded)
        return
    end

    applySettings(merge(Config.DefaultSettings, decoded))
end

local function resetSettings()
    SetResourceKvp(SETTINGS_KVP, json.encode(Config.DefaultSettings))
    applySettings(Config.DefaultSettings)
end

local function setVisible(state)
    HudState.settings.visible = state
    pushState()
end

local function toggle()
    setVisible(not HudState.settings.visible)
end

local function updatePlayerData(data)
    HudState.player = merge(HudState.player, data)
    pushState()
end

local function updateVehicleData(data)
    HudState.vehicle = merge(HudState.vehicle, data)
    pushState()
end

local function updateEnvironmentData(data)
    HudState.environment = merge(HudState.environment, data)
    pushState()
end

local function updateVoiceState(mode, transmitting)
    HudState.environment.voice.mode = mode
    HudState.environment.voice.transmitting = transmitting
    pushState()
end

RegisterNUICallback('saveSettings', function(data, cb)
    saveSettings(data.settings or Config.DefaultSettings)
    SetNuiFocus(false, false)
    cb({ success = true })
end)

RegisterNUICallback('toggle', function(_, cb)
    toggle()
    cb({ success = true })
end)

RegisterNUICallback('close', function(_, cb)
    SetNuiFocus(false, false)
    cb({ success = true })
end)

RegisterNUICallback('focus', function(_, cb)
    SetNuiFocus(true, true)
    cb({ success = true })
end)

RegisterNUICallback('reset', function(_, cb)
    resetSettings()
    cb({ success = true, settings = HudState.settings })
end)

RegisterNUICallback('nuiReady', function(_, cb)
    NuiReady = true
    pushState()
    cb({ success = true, settings = HudState.settings, phrases = Locale.phrases })
end)

RegisterCommand('hud', function()
    if not NuiReady then return end
    SetNuiFocus(true, true)
    sendHudMessage({ action = 'openSettings' })
end)

RegisterCommand('hudreset', function()
    resetSettings()
end)

RegisterKeyMapping('hud', 'Open Aura HUD settings', 'keyboard', Config.Keybinds.openSettings or 'F9')

exports('SetVisible', setVisible)
exports('Toggle', toggle)

AuraHud = {
    HudState = HudState,
    Locale = Locale,
    SetVisible = setVisible,
    Toggle = toggle,
    ApplySettings = applySettings,
    SaveSettings = saveSettings,
    LoadSettings = loadSettings,
    ResetSettings = resetSettings,
    UpdatePlayerData = updatePlayerData,
    UpdateVehicleData = updateVehicleData,
    UpdateEnvironmentData = updateEnvironmentData,
    UpdateVoiceState = updateVoiceState,
    PushState = pushState,
    SendHudMessage = sendHudMessage
}
