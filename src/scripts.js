let pokemonRepository = (function () {
  let pokemonList = [];

  let printedList = document.querySelector('.pokemon-list');

  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=200';

  let inputField = document.querySelector('.search');

  let pokemonModal = document.querySelector('.modal-dialog');

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

  // Called in case of loading error and while executing search
  function removeList() {
    printedList.innerHTML = '';
  }

  // Called in case of loading error and when manually hiding modal
  function hideModal() {
    pokemonModal.classList.add('hidden');
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

  function getAll() {
    return pokemonList;
  }

  function addListPokemon(pokemon) {
    // Details have to be loaded to be able to use frontImageUrl
    loadDetails(pokemon).then(function () {
      let listPokemon = document.createElement('li');
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

      // Triggering showDetails() of respective Pokemon upon button click
      button.addEventListener('click', function () {
        showDetails(pokemon);
      });
    });
  }

  // Implementing search box functionality
  function filterPokemons(query) {
    return pokemonList.filter(function (pokemon) {
      // toLowerCase() method to make input not case-sensitive
      let pokemonLowerCase = pokemon.name.toLowerCase();
      let queryLowerCase = query.toLowerCase();
      return pokemonLowerCase.startsWith(queryLowerCase);
    });
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
        // Adding details to Pokemon by defining pokemon object-keys.
        pokemon.frontImageUrl = details.sprites.front_default;
        pokemon.backImageUrl = details.sprites.back_default;
        pokemon.height = details.height;

        let arrayOfTypes = [];
        details.types.forEach(function (item) {
          arrayOfTypes.push(item.type.name);
        });
        // Defining separator between printed array items
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

  // Function to be called upon clicking Pokemon buttons: 1. Fetching Pokemon details and then 2. open modal with details
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
      heightElement.innerText = 'Height: ' + pokemon.height / 10 + ' m';

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
    });
  }

  // Hiding modal using Escape key.
  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      hideModal();
    }
  });

  // Returning a new object with keys that penetrate the IIFE ("public functions") - a dictionary.
  return {
    showLoadingSpinner: showLoadingSpinner,
    hideLoadingSpinner: hideLoadingSpinner,
    add: add,
    removeList: removeList,
    hideModal: hideModal,
    showErrorMessage: showErrorMessage,
    loadList: loadList,
    getAll: getAll,
    addListPokemon: addListPokemon,
    filterPokemons: filterPokemons,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

// Implementation of all Pokemon from the external API in the app's DOM. List should only be displayed after the data is loaded from the API.
pokemonRepository.loadList().then(function () {
  function printList(pokemon) {
    pokemonRepository.addListPokemon(pokemon);
  }

  pokemonRepository.getAll().forEach(printList);
});
