AuraHudFuelAdapters = AuraHudFuelAdapters or {}

local Adapter = {}

function Adapter.getFuel(vehicle)
    if not vehicle or vehicle == 0 then
        return 0
    end

    if GetResourceState('ox_fuel') == 'started' then
        local success, value = pcall(function()
            return exports.ox_fuel:getFuel(vehicle)
        end)
        if success and value then
            return value
        end
    end

    return GetVehicleFuelLevel(vehicle)
end

AuraHudFuelAdapters['ox'] = Adapter
