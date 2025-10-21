fx_version 'cerulean'
game 'gta5'

lua54 'yes'

ui_page 'web/dist/index.html'

files {
    'web/dist/index.html',
    'web/dist/assets/*.js',
    'web/dist/assets/*.css',
    'web/dist/assets/*.png',
    'web/dist/assets/*.svg',
    'web/dist/assets/*.woff2'
}

shared_scripts {
    'config.lua',
    'locales/en.lua',
    'shared/types.lua'
}

client_scripts {
    'client/utils.lua',
    'client/player.lua',
    'client/vehicle.lua',
    'client/main.lua',
    'client/adapters/*.lua'
}

server_scripts {
    'server/main.lua'
}

-- escrow_ignore {
--     'config.lua',
--     'locales/*',
--     'web/**'
-- }
