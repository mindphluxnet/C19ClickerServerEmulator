# Installation: Game

Since the game is no longer on the Steam store you can use 
**steam://install/1316610** to install it. As the official server has been shut down my
my custom loader is required. You can find it in the [release](https://github.com/mindphluxnet/C19ClickerServerEmulator/releases/tag/release) section of this repository; 
simply unzip it to the game directory.

# Installation: Server

Requires Node.js 16.16.x

``` 
git clone https://github.com/mindphluxnet/C19ClickerServerEmulator
cd C19ClickerServerEmulator
npm install
```

You can then start the server using

```
npm start
```

or, for testing purposes, with nodemon active (this also wipes the database)

```
npm wipestart
```

or 

```
npm devstart
```

with nodemon active without wiping the database.

# Gameplay changes

* Originally the game only added Resistance to Virus (RTV) when the user was actively playing, which feels wrong for a clicker game. Since there's a server involved anyway
I've patched the game to use the server-side RTV value only. The server now also adds 1 RTV for every 5 seconds the player was offline. This makes the game much more playable.

# What works - and what doesn't

* User accounts: working. New users get a new account created automatically. Now uses Steam to get an UDID.
* User login: working.
* User rename: working.
* Leaderboards: working so far but probably needs more development.
* Categories: more or less working, but unlocks aren't functioning properly and numbers are made up.
* Tasks: working.
* Cards: partially working, but missing data.
* Advancement: working.
* Persistence: mostly working except for task progress. 

# Problems

Most features are working now to a point where the game is playable. However, due to missing information the numbers
are likely all wrong and balancing is off. Unfortunately the original developer doesn't react to emails so there's no
way to get the missing info.
