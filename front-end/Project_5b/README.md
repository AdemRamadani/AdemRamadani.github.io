# Health Tracker
## Overview

This is a daily calorie counter SPA, built using [Backbone.js](http://backbonejs.org/), Bootstrap and Firebase.

## Quickstart

[Find the app here](http://trolster.github.io/health-tracker/).

## Description

This project was developed as a test-project for the Udacity Nanodegree in Front-End Development. It's a single page app, built with [backbone.js](http://backbonejs.org/), that tracks the user's daily calorie intake. Typing food names into the search field will display a list of matching foods as provided by the [Nutritionix API](https://developer.nutritionix.com/docs/v1_1). Users are then able to select an item from the list, and the item will be added to the list of foods the user is tracking. The total calorie count will also update to reflect the new daily total. Using the calendar the user can navigate between tracked days.

## How to run the app on your local machine

[Download](https://github.com/trolster/health-tracker/archive/master.zip) the project or run the following command in the shell:

  ``` shell
  $ git clone https://github.com/trolster/health-tracker.git
  ```
To get started you will need to have node.js with gulp installed and run the following commands in the shell:

  ``` shell
  $ git clone https://github.com/trolster/health-tracker.git
  $ cd /path/to/project-folder
  $ npm install
  $ gulp serve
  ```
The browserSync module will automatically open a new tab on localhost:3000.

To use the production version of the app, you simply run `gulp serve:dist`.

### GitHub Pages

If you download and change the code, you have to redeploy the gh-pages branch. The gh-pages branch is a subtree of only the /dist folder. It is served from [here](http://trolster.github.io/health-tracker/). To commit to the branch you have to run the following commands in the shell:

  ``` shell
  $ gulp # This builds the files in /dist
  $ git subtree push --prefix dist origin gh-pages # Push the subtree to gh-pages
  ```
For a full guide to deploying a subfolder to GitHub Pages, read [this](http://www.damian.oquanta.info/posts/one-line-deployment-of-your-site-to-gh-pages.html).

## License

Apache 2.0  
Copyright 2015 Mikkel Trolle Larsen

Enjoy!
