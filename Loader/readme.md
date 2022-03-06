# Custom Patch Loader

Since the game has several issues that need fixing before being able to even launch it properly
I had to come up with this loader. Simply download Loader.zip and extract it into the game's directory.

The loader uses Doorstop to inject BepInEx into the game process which injects my custom DLL. 
# Changes

* changes server IP to localhost to enable local server use
* implemented incomplete UpdateTask method
* UDID is now SteamUserID instead of something that only really seems to work on mobile devices

# Fixes

* used language is now always English as the game crashes when user's system is using any other language
* correctly implemented Steamworks as it was never initialized
