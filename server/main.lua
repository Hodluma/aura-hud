local QBCore = exports['qb-core']:GetCoreObject()

AddEventHandler('onResourceStart', function(resource)
    if resource ~= GetCurrentResourceName() then return end
    print('[Aura HUD] Resource started and ready.')
end)

RegisterNetEvent('aura-hud:server:syncMoney', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local money = Player.PlayerData.money or {}
    TriggerClientEvent('aura-hud:client:moneySync', src, money)
end)
