// The array pokemonList is wrapped in an IIFE function to make its elements inaccessible from the outside. Exception: the two well-defined keys that are returned by the IIFE function.
let pokemonRepository = (function() {

    // Array definition (empty), becaue Pokemons will be pushed from API
    let pokemonList = [];

    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=1154';

    let pokemonModal = document.querySelector('.modal-dialog');
    
    // Function declarations are not ended with a semicolon, because they are not executable statements.
    // This function will be used when Pokemons can be added without hardcoding the values.
    function add(pokemon) { 
        // Validation of input type: Has to be an object which contains the keys name and detailsUrl
        if (typeof pokemon === 'object' 
        && Object.keys(pokemon).includes('name' && 'detailsUrl')) {
            // .push method adds elements to the end of the array
            pokemonList.push(pokemon);
        } else {
            console.error('Pokémon has to be added using this format: {name:, detailsUrl:}')
        }
    }

    // Function to filter Pokemon names by starting letters, using the filter() method. It creates a copy af the targeted array including only those objects for which the filter() function returns a truthy value.
    // Parameter query represents the search input. 
    function filterPokemons(query) {
        return pokemonList.filter(
            // Pokemon.name can not be used because pokemon has not been defined in this function yet.
            function (pokemon) {
                // toLowerCase() method was used so the input is not case-sensitive
                // Concise form: return pokemon.name.toLowerCase().startsWith(query.toLowerCase());
                // Verbose form:
                let pokemonLowerCase = pokemon.name.toLowerCase();
                let queryLowerCase = query.toLowerCase();
                return pokemonLowerCase.startsWith(queryLowerCase);
            }
        );
    }
    
    function getAll() {
        return pokemonList;
    }

    // DOM manipulation
    function addListPokemon(pokemon) {

        let pokemonList = document.querySelector('.pokemon-list');

        // Creating list item elements.
        let listPokemon = document.createElement('li');
        // Adding Bootstrap utility class
        listPokemon.classList.add('col');
    
        let button = document.createElement('button');
        button.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);;
        // Adding class="pokemon-button" to listItem. Specific CSS style for this class defined in CSS stylesheet.
        button.classList.add('pokemon-button');
        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '.modal');
        // Appending button to listPokemon as its child.
        listPokemon.appendChild(button);
        // Appending listPokemon to pokemonList as its child.
        pokemonList.appendChild(listPokemon);

        // Event Listener records any clicking on Pokemon buttons, which triggers the showDetails function declared above (Event Handler), using the clicked-on Pokemon as parameter.
        button.addEventListener('click', function() {
            showDetails(pokemon);
        })
    }

    // Show and hide Bootstrap loading spinner functions
    function showLoadingSpinner (loadingContent) {
        let loadingSpinnerContainer = document.createElement('div');
        loadingSpinnerContainer.classList.add('text-center');
        loadingSpinnerContainer.classList.add('spinner-container');
        let loadingSpinner = document.createElement('div');
        loadingSpinner.classList.add('spinner-border');
        loadingSpinner.setAttribute('label', 'status');
        let screenReaderInfo = document.createElement('span');
        screenReaderInfo.classList.add('sr-only');
        screenReaderInfo.innerText = 'Loading...';
        loadingSpinner.appendChild(screenReaderInfo);
        loadingSpinnerContainer.appendChild(loadingSpinner);
        loadingContent.appendChild(loadingSpinnerContainer);
    }
    function hideLoadingSpinner (loadingContent) {
        let loadingSpinnerContainer = document.querySelector('.spinner-container');
        loadingContent.removeChild(loadingSpinnerContainer);
    }

    // Promise-fetch-function: API URL will be fetched. Result of the promise is the response which will be converted to a JSON in another promise function. When that is successful, a forEach loop will be run on each Pokemon item in the json.results array, creating a pokemon variable object containing two keys, name and detailsUrl. After, run add() function (declared above) to add all those pokeons to the pokemonList array.
    function loadList() {
        let loadingContainer = document.querySelector('main');
        showLoadingSpinner(loadingContainer);
        return fetch(apiUrl).then(function (response) {
            return response.json();
        // json represents the API object in JSON format - .results is an object key of the external API including an array of Pokemon objects.
        }).then(function (json) {
            hideLoadingSpinner(loadingContainer);
            // Question: Am I allowed to do this at all or is that bad practice? I have to access the array in my handleSwipes() function. I had read somewhere, when I don't add let, the variable will be accessible everywhere. But what am I defining here? A global variable? I feel like that should be avoided... it there a way to easily solve this?
            pokemonArray = json.results;
            pokemonArray.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url,
                    // Important for swipe function
                    index: pokemonArray.indexOf(item)
                };
                add(pokemon);
            }); 
        }).catch(function (e) {
            hideLoadingSpinner(loadingContainer);
            console.error(e);
        })
    }

    function loadDetails (pokemon) {
        // detailsUrl was defined within the loadList() function. loadList() is called when loading the page, running .addListPokemon() for every Pokemon in the API. AddListPokemon() hosts an event listener on the Pokemon button, calling showDetails() upon button click, which in turn contains loadDetails() as a promise.
        let url = pokemon.detailsUrl;
        let loadingContainer = document.querySelector('.modal-content');
        showLoadingSpinner(loadingContainer);
        return fetch(url).then (function (response) {
            return response.json();
        }). then (function (details) {
            hideLoadingSpinner(loadingContainer);
            // Adding details to pokemon by defining pokemon object-keys. (Let is not necessary to define new keys or key-value pairs.)
            // Sprites are collections of images put into a single image.
            pokemon.frontImageUrl = details.sprites.front_default;
            pokemon.backImageUrl = details.sprites.back_default;
            pokemon.height = details.height;
            // Extracting an array of types from the API type information. Their suggestion is to create a forLoop to iterate throught the API types object and pushing just the types into an empty array of types- and then display that to the user. Like so:
            let arrayOfTypes = [];
            details.types.forEach(function (item) {
                arrayOfTypes.push(item.type.name);
            });
            // .join() defines the separator between printed array items
            pokemon.types = arrayOfTypes.join(', ');
            let arrayOfAbilities = [];
            details.abilities.forEach(function (item) {
                arrayOfAbilities.push(item.ability.name);
            });
            pokemon.abilities = arrayOfAbilities.join(', ');
        }).catch (function (e) {
            hideLoadingSpinner(loadingContainer);
            console.error(e);
        });
    }

    // Creating function to be called upon clicking Pokemon buttons: 1. Fetch pokemon details (only done when clicked on button) and then 2. open a modal with Pokemon details
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            // let modalHeader = document.querySelector('.modal-header');
            let modalTitle = document.querySelector('.modal-title');
            let modalBody = document.querySelector('.modal-body');

            // Clearing previous modal content
            modalTitle.innerHTML = '';
            modalBody.innerHTML = '';

            // Creating modal content elements
            let nameElement = document.createElement('h2');
            nameElement.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
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

            modalTitle.appendChild(nameElement);
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
        });
    }

    // To hide modal upon pressing Escape key. Followed Bootstrap documentation regarding how to manually hide the modal (use of jQuery is mandatory)
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            $('.modal').modal('hide');
        }
    });

    // Function to be called when swiping between modals
    // Question: In the code example I used to help, at the very start of their code they set touchstartX, etc (basically all coordinates) to 0, like let touchStartX = 0, etc. Why?
    // Question: This function has 5 parameters. Is it bad practice having so many? Is there a better way?
    function handleSwipes (pokemon, touchStartX, touchStartY, touchEndX, touchEndY) {

        // If statements to avoid bugs when swiping at first or last Pokemon of array
        if ( pokemon.index < pokemonArray.length - 1 ) {
            let nextPokemonItem = pokemonArray[pokemon.index + 1];
            // Important to define Pokemon object just like in loadList(), since pokemonArray[] just returns an item, but showDetails() (and within it, loadDetails()) works with an object and its keys. 
            // Question: Is there a more straightforward way of doing this?
            nextPokemon = {
                name: nextPokemonItem.name,
                detailsUrl: nextPokemonItem.url,
                index: pokemonArray.indexOf(nextPokemonItem)
            };
        }
        if ( pokemon.index > 0 ) {
            let prevPokemonItem = pokemonArray[pokemon.index - 1];
            prevPokemon = {
                name: prevPokemonItem.name,
                detailsUrl: prevPokemonItem.url,
                index: pokemonArray.indexOf(prevPokemonItem)
            };
        }

        let deltaX = touchEndX - touchStartX;
        let deltaY = touchEndY - touchStartY;
        // Math.abs() returns absolute value of a number (so positive or negativ won't play a role)
        if ( Math.abs(deltaX) > Math.abs(deltaY) ) {
            // Only swipe if movement greater than 30 px, ignore smaller movements
            if ( deltaX > 30 ) {
                showDetails(prevPokemon);
            } else if ( deltaX < -30) {
                showDetails(nextPokemon);
            }
        } else if ( Math.abs(deltaX) < Math.abs(deltaY) ) {
            if ( deltaY > 30 ) {
                showDetails(prevPokemon);
            } else if ( deltaY < -30) {
                showDetails(nextPokemon);
            }
        }
    }
    
    // Return a new object with keys that penetrate the IIFE ("public functions") - a dictionary.
    return {
        add: add,
        filterPokemons: filterPokemons,
        getAll: getAll,
        addListPokemon: addListPokemon,
        showLoadingSpinner: showLoadingSpinner,
        hideLoadingSpinner: hideLoadingSpinner,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails,
        handleSwipes: handleSwipes
    };

// The IIFE function is self-executing, hence why it ends with parentheses
})();

// Implementation of all Pokemon from the external API in the app's DOM. List should only be displayed after the data is loaded from the API.
pokemonRepository.loadList().then(function() {
    // Now the data is loaded! Following is the callback function which has two functions as a value. First, the function which should be looped over each array item. addListPokemon() function is called within the function declaration. Parameter of the printList() function has to be the same as the addListPokemon()'s arguments.
    function printList(pokemon) {
        pokemonRepository.addListPokemon(pokemon);
    }
    // Calling the forEach method to run the addListPokemon function for every array item of the pokemonList array. (Has to be accessed by calling the getAll() function.) ForEach method takes functions as arguments.
    pokemonRepository.getAll().forEach(printList);
});