local QBCore = exports['qb-core']:GetCoreObject()

local lastVitals = {
    health = -1,
    armor = -1,
    stamina = -1,
    oxygen = -1
}

local lastNeeds = {
    hunger = -1,
    thirst = -1,
    stress = -1
}

local function round(value)
    return math.floor(value + 0.5)
end

local function calculateHealth(ped)
    local maxHealth = GetEntityMaxHealth(ped)
    local health = GetEntityHealth(ped)
    if maxHealth <= 0 then return 0 end
    return math.max(0, math.min(100, round(((health - 100) / (maxHealth - 100)) * 100)))
end

local function calculateArmor(ped)
    return math.max(0, math.min(100, round(GetPedArmour(ped))))
end

local function calculateStamina(playerId)
    local remaining = GetPlayerSprintTimeRemaining(playerId)
    return math.max(0, math.min(100, round(remaining * 100)))
end

local function calculateOxygen(playerId)
    local remaining = GetPlayerUnderwaterTimeRemaining(playerId)
    local percent = (remaining / 10.0) * 100
    return math.max(0, math.min(100, round(percent)))
end

local function updateVitals()
    local ped = PlayerPedId()
    local playerId = PlayerId()

    local vitals = {
        health = calculateHealth(ped),
        armor = calculateArmor(ped),
        stamina = calculateStamina(playerId),
        oxygen = calculateOxygen(playerId),
        underwater = IsPedSwimmingUnderWater(ped)
    }

    local changed = false
    for key, value in pairs(vitals) do
        if lastVitals[key] ~= value then
            lastVitals[key] = value
            changed = true
        end
    end

    if changed then
        AuraHud.UpdatePlayerData(vitals)
    end
end

local function refreshNeeds(metadata)
    if not metadata then return end

    local needs = {
        hunger = round(metadata['hunger'] or 0),
        thirst = round(metadata['thirst'] or 0),
        stress = round(metadata['stress'] or 0)
    }

    local changed = false
    for key, value in pairs(needs) do
        if lastNeeds[key] ~= value then
            lastNeeds[key] = value
            changed = true
        end
    end

    if changed then
        AuraHud.UpdatePlayerData(needs)
    end
end

local function refreshIdentity()
    local data = QBCore.Functions.GetPlayerData()
    if not data then return end

    local payload = {
        id = GetPlayerServerId(PlayerId()),
        job = data.job or {},
        gang = data.gang or {},
        money = {
            cash = data.money and data.money['cash'] or 0,
            bank = data.money and data.money['bank'] or 0
        }
    }

    AuraHud.UpdatePlayerData(payload)
    refreshNeeds(data.metadata)
end

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    AuraHud.LoadSettings()
    refreshIdentity()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    AuraHud.UpdatePlayerData({
        job = {},
        gang = {},
        money = { cash = 0, bank = 0 }
    })
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(data)
    refreshNeeds(data.metadata)
    if data.job then
        AuraHud.UpdatePlayerData({ job = data.job })
    end
    if data.gang then
        AuraHud.UpdatePlayerData({ gang = data.gang })
    end
    if data.money then
        AuraHud.UpdatePlayerData({ money = data.money })
    end
end)

RegisterNetEvent('hud:client:UpdateNeeds', function(hunger, thirst, stress)
    local needs = {
        hunger = round(hunger or lastNeeds.hunger),
        thirst = round(thirst or lastNeeds.thirst),
        stress = round(stress or lastNeeds.stress)
    }
    AuraHud.UpdatePlayerData(needs)
end)

RegisterNetEvent('QBCore:Client:OnJobUpdate', function(job)
    AuraHud.UpdatePlayerData({ job = job })
end)

RegisterNetEvent('QBCore:Client:OnGangUpdate', function(gang)
    AuraHud.UpdatePlayerData({ gang = gang })
end)

RegisterNetEvent('QBCore:Client:OnMoneyChange', function(type, amount, isAddition, reason)
    local data = QBCore.Functions.GetPlayerData()
    if not data then return end
    AuraHud.UpdatePlayerData({
        money = data.money or {}
    })
end)

RegisterNetEvent('aura-hud:client:moneySync', function(money)
    if money then
        AuraHud.UpdatePlayerData({ money = money })
    end
end)

CreateThread(function()
    while true do
        updateVitals()
        Wait(Config.Throttle.playerVitals or 400)
    end
end)

AuraHudPlayer = {
    RefreshIdentity = refreshIdentity,
    RefreshNeeds = refreshNeeds
}
