# Pokédex App

## Table of Contents

- [overview]
  - [key_features]
- [links]
- [process]
  - [programming_languages]
  - [dependencies]
  - [used_resources]

## Overview

Pokédex app is a a small web application built with HTML, CSS, and JavaScript.
It loads data from an external API and enables the viewing of Pokémon details on demand.

### Key Features

- Load data from an external source (API)
- View a list of items
- On user action (e.g., by clicking on a list item), view details for that item
- Switch between items using swipe or arrow keys
- View loading spinners while fetching API data

## Links

- [Code URL](https://github.com/ElenaUJ/pokedex-js-app)
- [Live Site URL](https://elenauj.github.io/pokedex-js-app/)

## Process

### Programming Languages

- HTML
- CSS
- JavaScript ES6 (using polyfills for older browsers)

### Dependencies

- Polyfills
  - [Promise polyfill](https://raw.githubusercontent.com/taylorhakes/promise-polyfill/master/dist/polyfill.min.js)
  - [Fetch polyfill](https://github.com/github/fetch/releases/download/v3.0.0/fetch.umd.js)
- Frameworks
  - [Bootstrap](https://getbootstrap.com/docs/4.3/getting-started/introduction/)
- [ESLint rules](https://github.com/mydea/simple-pokedex-app/blob/master/.eslintrc)
- [Prettier configuration](https://stackoverflow.com/questions/55430906/prettier-single-quote-for-javascript-and-json-double-quote-for-html-sass-and-c)

### Used resources

- [PokéAPI used for this application](https://pokeapi.co/api/v2/pokemon/)
- [Example used as rough template for Swipe function](https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d?permalink_comment_id=3753498#gistcomment-3753498)
