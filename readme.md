# Installation: Game

Since the game is no longer on the Steam store you can use 
steam://install/1316610 to install it. By default it doesn't work and requires
my custom loader to run. You can find it in the Loader directory of this repository; 
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
* User rename: working.
* Leaderboards: working so far but probably needs more development.
* Categories: working, but numbers are completely made up.
* Tasks: working, but only placeholder data is sent.
* Cards: partially working, but missing data.
* Advancement: not working.

# Problems

After working with the game's code for a while I noticed that some parts have never been finished.
For example Tasks are not saved to the server as the function only contains dummy code. It's also 
unclear what clicking the advance button actually does server-side. I know what it's supposed to return
but that can't be all it does.
