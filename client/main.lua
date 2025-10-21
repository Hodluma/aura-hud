local ResourceName = GetCurrentResourceName()

local lastStreet = ''
local lastZone = ''
local lastCompass = ''
local lastDegrees = 0
local lastTime = ''
local lastHidden = false
local lastVoice = {
    mode = 'unknown',
    transmitting = false
}

local function getCompassDirection(degrees)
    local directions = { 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW' }
    local index = math.floor((degrees + 22.5) / 45.0) % 8 + 1
    return directions[index]
end

local function updateEnvironment()
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local streetHash, crossingHash = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
    local street = GetStreetNameFromHashKey(streetHash)
    if crossingHash and crossingHash ~= 0 then
        street = street .. ' / ' .. GetStreetNameFromHashKey(crossingHash)
    end
    local zone = GetLabelText(GetNameOfZone(coords.x, coords.y, coords.z))
    if zone == 'NULL' then zone = '' end

    local heading = GetEntityHeading(ped)
    local compassDir = getCompassDirection(heading)
    local degrees = math.floor(heading + 0.5)

    local hour = GetClockHours()
    local minute = GetClockMinutes()
    local time = string.format('%02d:%02d', hour, minute)

    local updated = false

    if street ~= lastStreet or zone ~= lastZone then
        lastStreet = street
        lastZone = zone
        updated = true
    end

    if compassDir ~= lastCompass or degrees ~= lastDegrees then
        lastCompass = compassDir
        lastDegrees = degrees
        updated = true
    end

    if time ~= lastTime then
        lastTime = time
        updated = true
    end

    if updated then
        AuraHud.UpdateEnvironmentData({
            street = street,
            zone = zone,
            time = time,
            compass = {
                direction = compassDir,
                degrees = degrees
            }
        })
    end
end

local function resolveVoiceMode()
    local proximity = LocalPlayer.state['proximity']
    if type(proximity) == 'table' then
        if proximity.mode then
            return string.lower(proximity.mode)
        end
        if proximity.index then
            local modes = { 'whisper', 'normal', 'shout' }
            return modes[proximity.index] or 'unknown'
        end
    end
    return 'unknown'
end

local function isTransmitting()
    local state = LocalPlayer.state
    if type(state) ~= 'table' then return false end
    return state['radioTalking'] or state['voiceActive'] or state['callChannel'] ~= nil or state['isTransmitting'] or false
end

local function updateVoice()
    local mode = resolveVoiceMode()
    local transmitting = isTransmitting()

    if lastVoice.mode ~= mode or lastVoice.transmitting ~= transmitting then
        lastVoice.mode = mode
        lastVoice.transmitting = transmitting
        AuraHud.UpdateVoiceState(mode, transmitting)
    end
end

local function updateHidden()
    local hidden = false
    if not AuraHud.HudState.settings.alwaysOn then
        hidden = IsPauseMenuActive() or (LocalPlayer.state and (LocalPlayer.state['invOpen'] or LocalPlayer.state['inventoryOpen'] or LocalPlayer.state['inInventory'] or LocalPlayer.state['isMenuOpen'])) or false
    end

    if hidden ~= lastHidden then
        lastHidden = hidden
        AuraHud.UpdateEnvironmentData({ hidden = hidden })
    end
end

CreateThread(function()
    AuraHud.LoadSettings()
    if AuraHudPlayer and AuraHudPlayer.RefreshIdentity then
        AuraHudPlayer.RefreshIdentity()
    end

    while true do
        updateEnvironment()
        updateHidden()
        Wait(Config.Throttle.street or 600)
    end
end)

CreateThread(function()
    while true do
        updateVoice()
        Wait(250)
    end
end)

AddEventHandler('onResourceStart', function(resource)
    if resource ~= ResourceName then return end
    Wait(500)
    AuraHud.LoadSettings()
    if AuraHudPlayer and AuraHudPlayer.RefreshIdentity then
        AuraHudPlayer.RefreshIdentity()
    end
end)

RegisterNetEvent('pma-voice:setTalkingMode', function(mode)
    if type(mode) == 'string' then
        lastVoice.mode = mode:lower()
        AuraHud.UpdateVoiceState(lastVoice.mode, lastVoice.transmitting)
    end
end)

RegisterNetEvent('pma-voice:radioActive', function(active)
    lastVoice.transmitting = active and true or false
    AuraHud.UpdateVoiceState(lastVoice.mode, lastVoice.transmitting)
end)
