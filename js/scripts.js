// The array pokemonList is wrapped in an IIFE function to make its elements inaccessible from the outside. Exception: the two well-defined keys that are returned by the IIFE function.
let pokemonRepository = (function() {

    // Array definition (empty), becaue Pokemons will be pushed from API
    let pokemonList = [];

    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=500';

    let modalContainer = document.querySelector('#modal-container');
    
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
    
        let button = document.createElement('button');
        // Function takes pokemon as parameter, so it has to be used as a selector for the button text.
        button.innerText = pokemon.name;
        // Adding class="button" to listItem. Specific CSS style for this class defined in CSS stylesheet.
        button.classList.add('pokemon-button');
        // Appending button to listPokemon as its child.
        listPokemon.appendChild(button);
        // Appending listPokemon to pokemonList as its child.
        pokemonList.appendChild(listPokemon);

        // Event Listener records any clicking on Pokemon buttons, which triggers the showDetails function declared above (Event Handler), using the clicked-on Pokemon as parameter.
        button.addEventListener('click', function() {
            showDetails(pokemon);
        })
    }

    // Promise-fetch-function: API URL will be fetched. Result of the promise is the response which will be converted to a JSON in another promise function. When that is successful, a forEach loop will be run on each Pokemon item in the json.results array, creating a pokemon variable object containing two keys, name and detailsUrl. After, run add() function (declared above) to add all those pokeons to the pokemonList array.
    function loadList () {
        // Show and hide loading message definitions. Alternatively, instead of modifyig my HTML file, I could create a paragraph element in the DOM, define its inner text and append it to the <main> parent. For hideLoadingMessage I could remove it again. Is that a better way of doing it? I would have to add html though, which as per course is not recommended because it is more error-prone. Another option: To create a parargraph in the HTML file, while loading setting its inner text to please wait. To hide the message when it's done loading, set the inner text to an empty string.
        let loadingMessage = document.querySelector('.loading-message');
        function showLoadingMessage () {
            loadingMessage.classList.remove('hidden');
        }
        function hideLoadingMessage () {
            loadingMessage.classList.add('hidden');
        }
        showLoadingMessage();
        return fetch(apiUrl).then(function (response) {
            return response.json();
        // json represesents the API object in JSON format - .result is an object key of the external API including an array of Pokemon objects.
        }).then(function (json) {
            hideLoadingMessage();
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            }); 
        }).catch(function (e) {
            hideLoadingMessage();
            console.error(e);
        })
    }

        // Question: How can we use the detailsUrl key here? I thought one cannot use variables beyond the scope of a function, and detailsUrl was defined within the loadList() function.
    function loadDetails (pokemon) {
        let url = pokemon.detailsUrl;
        return fetch(url).then (function (response) {
            return response.json();
        }). then (function (details) {
            // Adding details to the item (parameter of the loadDetails() function) by defining (item object-keys?) variables (Question: Why is let not necessary here?)
            // .sprites/front_default etc. keys originate in the API. Sprites are collections of images put into a single image.
            pokemon.imageUrl = details.sprites.front_default;
            pokemon.height = details.height;
            // Extracting an array of types from the API type information. Their suggestion is to create a forLoop to iterate throught the API types object and pushing just the types into an empty array of types- and then display that to the user. Like so:
            let arrayOfTypes = [];
            details.types.forEach(function (item) {
                arrayOfTypes.push(item.type.name);
            });
            pokemon.types = arrayOfTypes;
        }).catch (function (e) {
            console.error(e);
        });
    }

    // Creating function to be called upon clicking Pokemon buttons: 1. Fetch pokemon details (only done when clicked on button) and then 2. open a modal with Pokemon details (by adding "is-visible" class to modal-container)
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            // Clearing all existing modal content
            modalContainer.innerHTML = '';

            // Add new modal and modal content
            let pokemonModal = document.createElement('div');
            pokemonModal.classList.add('modal');
            let closeButtonElement = document.createElement('button');
            closeButtonElement.classList.add('modal__close');
            closeButtonElement.innerText = 'X';
            closeButtonElement.addEventListener('click', hideDetails);
            
            let titleElement = document.createElement('h2');
            titleElement.innerText = pokemon.name;
            let contentElement = document.createElement('p');
            contentElement.innerHTML = 'height: ' + pokemon.height + ' dm<br>type(s): ' + pokemon.types;
            let imageElement = document.createElement('img');
            imageElement.src = pokemon.imageUrl;

            pokemonModal.appendChild(closeButtonElement);
            pokemonModal.appendChild(titleElement);
            pokemonModal.appendChild(contentElement);
            pokemonModal.appendChild(imageElement);
            modalContainer.appendChild(pokemonModal);

            modalContainer.classList.add('is-visible');

            // Closing of modal when user clicks outside of modal (-> on modalContainer)
            modalContainer.addEventListener('click', function(event) {
                let target = event.target;
                if (target === modalContainer) {
                    hideDetails();
                }
            });
        });
    }

    // Function to be called when modal's closing button is clicked, esc key is pressed or when user clicks outside of modal
    function hideDetails() {
        modalContainer.classList.remove('is-visible');
    }

    // Escape key event listener should only work when modal is visible.
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideDetails();
        }
    });

    // Return a new object with keys that penetrate the IIFE ("public functions"). Since they all have the same names for key and value, I could also just write add, filterPokemons, getAll, etc.
    // Does filterPokemons belong here? What about others. ... when I remove showDetails/hideDetails it it still works!
    return {
        add: add,
        filterPokemons: filterPokemons,
        getAll: getAll,
        addListPokemon: addListPokemon,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails,
        hideDetails: hideDetails
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