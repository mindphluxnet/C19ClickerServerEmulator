# Installation: Game

Since the game is no longer on the Steam store you can use 
**steam://install/1316610** to install it. As the official server has been shut down my
my custom loader is required. You can find it in the [Loader](Loader) directory of this repository; 
simply unzip it to the game directory.

# Installation: Server

Requires Node.js 12.13.x

``` 
git clone https://github.com/mindphluxnet/C19ClickerServerEmulator
cd C19ClickerServerEmulator
npm install
```

You can then start the server using

```
npm start
```

or with nodemon active

```
npm devstart
```

# What works - and what doesn't

* User accounts: working. New users get a new account created automatically. Now uses Steam to get an UDID.
* User login: working.
* User rename: working.
* Leaderboards: working so far but probably needs more development.
* Categories: more or less working, but unlocks aren't functioning properly and numbers are made up.
* Tasks: working.
* Cards: partially working, but missing data.
* Advancement: working.

# Problems

After working with the game's code for a while I noticed that some parts have never been finished.
For example Tasks are not saved to the server as the function only contains dummy code. It's also 
unclear what clicking the advance button actually does server-side. I know what it's supposed to return
but that can't be all it does.
