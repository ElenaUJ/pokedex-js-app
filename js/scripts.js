let pokemonRepository = (function () {
  let pokemonList = [];

  let printedList = document.querySelector('.pokemon-list');

  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=200';

  let inputField = document.querySelector('.search');

  let pokemonModal = document.querySelector('.modal-dialog');

  function add(pokemon) {
    // Validation of input type: Has to be an object which contains the keys name and detailsUrl
    if (
      typeof pokemon === 'object' &&
      Object.keys(pokemon).includes('name' && 'detailsUrl')
    ) {
      pokemonList.push(pokemon);
    } else {
      console.error(
        'Pokémon has to be added using this format: {name:, detailsUrl:}'
      );
    }
  }

  function filterPokemons(query) {
    return pokemonList.filter(
      function (pokemon) {
        // toLowerCase() method was used so the input is not case-sensitive
        let pokemonLowerCase = pokemon.name.toLowerCase();
        let queryLowerCase = query.toLowerCase();
        return pokemonLowerCase.startsWith(queryLowerCase);
      }
    );
  }
  function removeList() {
    printedList.innerHTML = '';
  }
  inputField.addEventListener('input', function () {
    let query = inputField.value;
    let filteredList = filterPokemons(query);
    removeList();
    if (filteredList.length === 0) {
      showErrorMessage(
        'Sorry. There are no Pokémon matching your search criteria.'
      );
    } else {
      filteredList.forEach(addListPokemon);
    }
  });

  function getAll() {
    return pokemonList;
  }

  function addListPokemon(pokemon) {
    loadDetails(pokemon).then(function () {
      let listPokemon = document.createElement('li');
      // Adding Bootstrap utility class
      listPokemon.classList.add('col');

      let button = document.createElement('button');
      let buttonText = document.createElement('h2');
      button.appendChild(buttonText);
      buttonText.innerText =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      button.classList.add('pokemon-button');
      button.setAttribute('data-toggle', 'modal');
      button.setAttribute('data-target', '.modal');
      let pokemonImage = document.createElement('img');
      pokemonImage.src = pokemon.frontImageUrl;
      button.appendChild(pokemonImage);

      listPokemon.appendChild(button);
      printedList.appendChild(listPokemon);

      button.addEventListener('click', function () {
        showDetails(pokemon);
      });
    });
  // Called in case of loading error and when manually hiding modal
  }

  function showLoadingSpinner(spinnerLocation) {
    let spinnerContainer = document.createElement('div');
    spinnerContainer.classList.add('text-center');
    let loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('spinner-border');
    loadingSpinner.setAttribute('role', 'status');
    let spinnerText = document.createElement('span');
    spinnerText.classList.add('sr-only');
    spinnerText.innerText = 'Loading...';
    loadingSpinner.appendChild(spinnerText);
    spinnerContainer.appendChild(loadingSpinner);
    spinnerLocation.appendChild(spinnerContainer);
  }
  function hideLoadingSpinner(spinnerLocation) {
    spinnerLocation.removeChild(spinnerLocation.lastChild);
  }
  function showErrorMessage(message) {
    let errorMessage = document.createElement('p');
    errorMessage.classList.add('error-message');
    errorMessage.classList.add('col-6');
    errorMessage.innerText = message;
    printedList.appendChild(errorMessage);
  }

  function loadList() {
    let spinnerLocation = document.querySelector('.main');
    showLoadingSpinner(spinnerLocation);
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        hideLoadingSpinner(spinnerLocation);
        pokemonArray = json.results;
        pokemonArray.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        hideLoadingSpinner(spinnerLocation);
        removeList();
        hideModal();
        showErrorMessage(
          "There don't seem to be any Pokémon around. If you are not offline, try again later."
        );
        console.error(e);
      });
  }

  function loadDetails(pokemon) {
    let spinnerLocation = document.querySelector('.modal-body');
    showLoadingSpinner(spinnerLocation);
    let url = pokemon.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        hideLoadingSpinner(spinnerLocation);
        pokemon.frontImageUrl = details.sprites.front_default;
        pokemon.backImageUrl = details.sprites.back_default;
        pokemon.height = details.height;
        let arrayOfTypes = [];
        details.types.forEach(function (item) {
          arrayOfTypes.push(item.type.name);
        });
        pokemon.types = arrayOfTypes.join(', ');
        let arrayOfAbilities = [];
        details.abilities.forEach(function (item) {
          arrayOfAbilities.push(item.ability.name);
        });
        pokemon.abilities = arrayOfAbilities.join(', ');
      })
      .catch(function (e) {
        hideLoadingSpinner(spinnerLocation);
        console.error(e);
      });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      let modalTitle = document.querySelector('.modal-title');
      let modalBody = document.querySelector('.modal-body');

      // Clearing previous modal content
      modalTitle.innerHTML = '';
      modalBody.innerHTML = '';

      // Creating modal content elements
      let nameElement = document.querySelector('.modal-title');
      nameElement.innerText =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      let imageElementFront = document.createElement('img');
      imageElementFront.classList.add('modal-img');
      imageElementFront.src = pokemon.frontImageUrl;
      let imageElementBack = document.createElement('img');
      imageElementBack.classList.add('modal-img');
      imageElementBack.src = pokemon.backImageUrl;
      let modalText = document.createElement('div');
      modalText.classList.add('modal-text');
      let heightElement = document.createElement('p');
      heightElement.innerText = 'Height: ' + pokemon.height + ' dm';
      let typesElement = document.createElement('p');
      typesElement.innerText = 'Types: ' + pokemon.types;
      let abilitiesElement = document.createElement('p');
      abilitiesElement.innerText = 'Abilities: ' + pokemon.abilities;
      modalBody.appendChild(imageElementFront);
      modalBody.appendChild(imageElementBack);
      modalBody.appendChild(modalText);
      modalText.appendChild(heightElement);
      modalText.appendChild(typesElement);
      modalText.appendChild(abilitiesElement);

      // Swiping between Pokemon modals
      // Question: Why does this only work when within the showDetails() function?
      pokemonModal.addEventListener('pointerdown', function (event) {
        touchStartX = event.clientX;
        touchStartY = event.clientY;
      });
      pokemonModal.addEventListener('pointerup', function (event) {
        touchEndX = event.clientX;
        touchEndY = event.clientY;
        handleSwipes(pokemon, touchStartX, touchStartY, touchEndX, touchEndY);
      });

      // Switching Pokemon by pressing arrow keys
      window.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          getPrevPokemon(pokemon);
          showDetails(prevPokemon);
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          getNextPokemon(pokemon);
          showDetails(nextPokemon);
        }
      });
    });
  }

  function hideModal() {
    pokemonModal.classList.add('hidden');
  }
  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      hideModal();
    }
  });

  // Functions to define next or previous Pokemon needed for swiping/arrow key funcitonality
  function getNextPokemon(pokemon) {
    // If statements to avoid bugs when swiping at last Pokemon of array
    if (pokemon.index < pokemonArray.length - 1) {
      let nextPokemonItem = pokemonArray[pokemon.index + 1];
      // Important to define Pokemon object just like in loadList(), since pokemonArray[] just returns an item, but showDetails() (and within it, loadDetails()) works with an object and its keys.
      return (nextPokemon = {
        name: nextPokemonItem.name,
        detailsUrl: nextPokemonItem.url,
        index: pokemonArray.indexOf(nextPokemonItem),
      });
    }
  }
  function getPrevPokemon(pokemon) {
    if (pokemon.index > 0) {
      let prevPokemonItem = pokemonArray[pokemon.index - 1];
      return (prevPokemon = {
        name: prevPokemonItem.name,
        detailsUrl: prevPokemonItem.url,
        index: pokemonArray.indexOf(prevPokemonItem),
      });
    }
  }

  // Function to be called when swiping between modals
  // Question: In the code example I used to help, at the very start of their code they set touchstartX, etc (basically all coordinates) to 0, like let touchStartX = 0, etc. Why?
  // Question: This function has 5 parameters. Is it bad practice having so many? Is there a better way?
  // Question: When I swipe too quickly through the modal, the app crashes. It will iterate through many Pokemon very fast and then become unresponsive... do you have any idea why that is the case??
  function handleSwipes(
    pokemon,
    touchStartX,
    touchStartY,
    touchEndX,
    touchEndY
  ) {
    getNextPokemon(pokemon);
    getPrevPokemon(pokemon);
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;
    // Math.abs() returns absolute value of a number (so positive or negativ won't play a role)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Only swipe if movement greater than 30 px, ignore smaller movements
      if (deltaX > 30) {
        showDetails(prevPokemon);
      } else if (deltaX < -30) {
        showDetails(nextPokemon);
      }
    } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
      if (deltaY > 30) {
        showDetails(prevPokemon);
      } else if (deltaY < -30) {
        showDetails(nextPokemon);
      }
    }
  }

  return {
    add: add,
    filterPokemons: filterPokemons,
    removeList: removeList,
    getAll: getAll,
    addListPokemon: addListPokemon,
    showLoadingSpinner: showLoadingSpinner,
    hideLoadingSpinner: hideLoadingSpinner,
    showErrorMessage: showErrorMessage,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    getNextPokemon: getNextPokemon,
    getPrevPokemon: getPrevPokemon,
    handleSwipes: handleSwipes,
  };
})();

// Implementation of all Pokemon from the external API in the app's DOM. List should only be displayed after the data is loaded from the API.
pokemonRepository.loadList().then(function () {
  function printList(pokemon) {
    pokemonRepository.addListPokemon(pokemon);
  }
  pokemonRepository.getAll().forEach(printList);
});
