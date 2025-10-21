local Locale = {}

Locale.phrases = {
    hud_title = 'Aura HUD',
    settings = 'Settings',
    save = 'Save',
    close = 'Close',
    reset = 'Reset',
    visibility = 'Visibility',
    theme = 'Theme',
    layout = 'Layout',
    opacity = 'Opacity',
    speed_unit = 'Speed Unit',
    money_display = 'Money Display',
    modules = 'Modules',
    always_on = 'Always On',
    smart = 'Smart',
    compact = 'Compact',
    expanded = 'Expanded',
    dark = 'Dark',
    neon = 'Neon',
    voice_icon = 'Voice Icon Style',
    unit_kmh = 'KM/H',
    unit_mph = 'MPH',
    map_strip = 'Map Strip',
    vehicle = 'Vehicle',
    job = 'Job',
    gang = 'Gang',
    id = 'Server ID',
    money = 'Money',
    health = 'Health',
    armor = 'Armor',
    hunger = 'Hunger',
    thirst = 'Thirst',
    stress = 'Stress',
    stamina = 'Stamina',
    oxygen = 'Oxygen',
    time = 'Time',
    compass = 'Compass',
    street = 'Street',
    voice = 'Voice',
    apply_tooltip = 'Apply and close the HUD settings.',
    reset_tooltip = 'Reset to default settings.',
    cash = 'Cash',
    bank = 'Bank',
    in_vehicle_only = 'Only visible in vehicle'
}

function Locale.t(key)
    return Locale.phrases[key] or key
end

return Locale
