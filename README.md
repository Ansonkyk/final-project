# Final Project

In this project, you'll build a web application that does anything you want! 

It must meet the project requirements below, but beyond that, feel free to use your creativity to decide on what your app will do.

## Requirements

* **Your app has at least three distinct "features"**
  * If you are building a travel planning application, one feature could be allowing users to create a new trip
* Your project has at least ten commits in git
* Your app is mobile responsive
* Your project contains a `README.md` file that explains what your project is and how to use it
* Your project is hosted on GitHub pages
* Your code is clean
  * Proper indentation
  * No unnecessary repetition
  * Variables as camelCase

## Project ideas

* Travel planner
* Budget manager
* Resume builder
* Shift scheduling app
* Chat bot
* Music making app
* Games
  * PacMan
  * Chess
* Do something with an external API: https://github.com/public-apis/public-apis
  * Slack / discord bot
  * Recreate Reddit
  * Pokedex

And so many more possibilities!

## Recommendations

* Start out by creating your project's foundation in HTML.
* Frequently make commmits in git to save your progress.
* Build one piece of Javascript functionality at a time, testing each change you make with `console.log`. 
* Keep your code meticulously organized as you go. 
* Use proper indentation, whitespace, and comments. 
* Try to write a function for each separate piece of functionality that exists in your code. This will make your code "modular" and easier to build off of.
* If you find yourself repeating code, think about how you could use either a loop or a new function to eliminate the repitition.


In this final project, my goal is to make a stock simulator. One of the ideas is to generate should someone buy or sell a stock by some simple stock buy and sell model and using yahoo finance to fetch data. The idea is that someone can wake up in the morning and input some stock symbol they are interested in. Then, the website will return whether the stock is worth investing in or should sell right away. The website will also plot a graph of last year's stock performance and how much the investor can make if they use such a model in their investment.
* The model I use will be simple, and ideally, I would input quite a few of them. Most of them use some average to determine if the stock is growing or dropping, 
* then the user will input the money they are going to invest and the symbol of the stock after submitting. 
* the program will grab the stock data, run an analysis using existing stock data, see the best action on the stock, show it, and show how much investors can make last year using this method. 
* save all previous analysis stock and display the stock have the highest income last year using such method(hopefully keep using the method this year will also gain that much)
* something similar to hacker news; I can display some news related to that stock(done). And may even analyze them(Working on it)
* Allow user to mock buy and sell stock
And the final stretch goal is to allow the user to choose between different methods rather than the only one way.


## Please don't rapid test any button on the website, espacially the buy, sell and submit button, since I am using a free version of api, it will start getting errors, those button only only use every in total 5 times every minute.
