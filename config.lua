Config = {}

Config.DefaultSettings = {
    version = 1,
    visible = true,
    theme = 'dark',
    layout = 'expanded', -- 'compact' or 'expanded'
    opacity = 0.95,
    speedUnit = 'kmh', -- 'kmh' or 'mph'
    moneyVisible = true,
    modules = {
        health = true,
        armor = true,
        hunger = true,
        thirst = true,
        stress = true,
        stamina = true,
        oxygen = true,
        job = true,
        gang = true,
        id = true,
        money = true,
        time = true,
        compass = true,
        street = true,
        voice = true,
        vehicle = true,
        mapStrip = false
    },
    voiceIconStyle = 'default',
    alwaysOn = false
}

Config.FuelAdapter = 'legacy' -- legacy | ox | dummy

Config.Throttle = {
    playerVitals = 400,
    playerMetadata = 1000,
    street = 600,
    vehicle = 200
}

Config.Keybinds = {
    openSettings = 'F9'
}

Config.Locale = 'en'

return Config
