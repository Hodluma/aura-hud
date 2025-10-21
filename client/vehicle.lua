local fuelAdapters = AuraHudFuelAdapters or {}
local FuelAdapter = fuelAdapters[Config.FuelAdapter] or fuelAdapters['dummy']

if not FuelAdapter then
    FuelAdapter = { getFuel = function(vehicle)
        return vehicle and vehicle ~= 0 and GetVehicleFuelLevel(vehicle) or 0
    end }
end

local function getIndicatorState(vehicle)
    local state = GetVehicleIndicatorLights(vehicle)
    return {
        left = state == 1 or state == 3,
        right = state == 2 or state == 3
    }
end

local function updateVehicle(vehicle)
    local speedMs = GetEntitySpeed(vehicle)
    local rpm = GetVehicleCurrentRpm(vehicle)
    local payload = {
        inVehicle = true,
        speed = {
            kmh = math.floor(speedMs * 3.6 + 0.5),
            mph = math.floor(speedMs * 2.23694 + 0.5)
        },
        gear = GetVehicleCurrentGear(vehicle),
        rpm = rpm,
        fuel = math.floor((FuelAdapter.getFuel(vehicle) or 0) + 0.5),
        engineHealth = GetVehicleEngineHealth(vehicle),
        seatbelt = LocalPlayer.state['seatbelt'] or LocalPlayer.state['Seatbelt'] or false,
        cruise = LocalPlayer.state['cruise'] or false,
        indicators = getIndicatorState(vehicle),
        engineOn = GetIsVehicleEngineRunning(vehicle)
    }

    AuraHud.UpdateVehicleData(payload)
end

CreateThread(function()
    local wasInVehicle = false
    while true do
        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)

        if vehicle ~= 0 then
            if not wasInVehicle then
                wasInVehicle = true
                AuraHud.UpdateVehicleData({ inVehicle = true })
            end

            updateVehicle(vehicle)
            Wait(Config.Throttle.vehicle or 200)
        else
            if wasInVehicle then
                wasInVehicle = false
                AuraHud.UpdateVehicleData({
                    inVehicle = false,
                    speed = { kmh = 0, mph = 0 },
                    gear = 0,
                    rpm = 0,
                    fuel = 0,
                    engineHealth = 0,
                    seatbelt = false,
                    cruise = false,
                    indicators = { left = false, right = false },
                    engineOn = false
                })
            end
            Wait(750)
        end
    end
end)
