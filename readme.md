# Installation: Game

Since the game is no longer on the Steam store you can use 
steam://install/1316610 to install it. By default it doesn't work and requires
my custom loader to run. You can find it in the Releases section of this repository; 
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

* User accounts: working. New users get a new account created automatically.
* User login: working.
* Leaderboards: working so far but probably needs more development.
* Categories: working, but numbers are completely made up.
* Tasks: working, but only placeholder data is sent.
* Cards: not working, only API endpoints are implemented right now.
* Advancement: not working.