AuraHudFuelAdapters = AuraHudFuelAdapters or {}

local Adapter = {}

function Adapter.getFuel(vehicle)
    if not vehicle or vehicle == 0 then
        return 0
    end

    return GetVehicleFuelLevel(vehicle)
end

AuraHudFuelAdapters['dummy'] = Adapter
