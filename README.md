# Pokédex App

## Table of Contents

- [Overview](#overview)
  - [Key Features](#key-features)
- [Links](#links)
- [How to Run](#how-to-run)
- [Process](#process)
  - [Programming Languages](#programming-languages)
  - [Dependencies](#dependencies)
  - [Used Resources](#used-resources)

## Overview

Pokédex app is a a small web application built with HTML, CSS, and JavaScript.
It loads data from an external API and enables the viewing of Pokémon details on demand.

### Key Features

- Load data from an external source (API)
- View a list of items
- Search for items to be displayed
- On user action (e.g., by clicking on a list item), view details for that item
- View loading spinners while fetching API data

## Links

- [Code URL](https://github.com/ElenaUJ/pokedex-js-app)
- [Live Site URL](https://elenauj.github.io/pokedex-js-app/)

## How to Run

1. Clone the Repository: Open your terminal and enter the following command to clone the repository:
   `git clone https://github.com/ElenaUJ/pokedex-js-app.git`

2. Navigate to the Project Directory: Change your working directory to the project folder by entering this command:
   `cd pokedex-js-app`

3. Open the App: After navigating to the project folder, locate the index.html file and double-click it. Your default web browser will open, displaying the Pokedex app.

## Process

### Programming Languages

- HTML
- CSS
- Vanilla JavaScript ES6

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
