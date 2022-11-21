// The array pokemonList is wrapped in an IIFE function to make its elements inaccessible from the outside. Exception: the two well-defined keys that are returned by the IIFE function.
let pokemonRepository = (function() {

    // Array definition (empty), becaue Pokemons will be pushed from API
    let pokemonList = [];

    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=500';
    
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

    // Creating function to be called upon clicking Pokemon buttons.
    function showDetails(pokemon) {
        console.log('Name: ' + pokemon.name + ', height: ' + pokemon.height + ' m, type(s): ' + pokemon.type);
    }

    function addListPokemon(pokemon) {

        let pokemonList = document.querySelector('.pokemon-list');

        // Creating list item elements.
        let listPokemon = document.createElement('li');
    
        let button = document.createElement('button');
        // Function takes pokemon as parameter, so it has to be used as a selector for the button text.
        button.innerText = pokemon.name;
        // Adding class="button" to listItem. Specific CSS style for this class defined in CSS stylesheet.
        button.classList.add('button');
        // Appending button to listPokemon as its child.
        listPokemon.appendChild(button);
        // Appending listPokemon to pokemonList as its child.
        pokemonList.appendChild(listPokemon);

        // Event Listener records any clicking on Pokemon buttons, which triggers the showDetails function declared above (Event Handler), using the clicked-on Pokemon as parameter.
        button.addEventListener('click', function() {
            showDetails(pokemon);
        })
    }

    // Return a new object with three keys that penetrate the IIFE ("public functions"): add, filterPokemons, and getAll. Since they all have the same names for key and value, I could also just write add, filterPokemons, getAll
    // Promise-fetch-function: API URL will be fetched. Result of the promise is the response which will be converted to a JSON in another promise function. When that is successful, a forEach loop will be run on each Pokemon item in the json.results array, creating a pokemon variable object containing two keys, name and detailsUrl. After, run add() function (declared above) to add all those pokeons to the pokemonList array.
    function loadList () {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        // json represesents the API object in JSON format - .result is an object key of the external API including an array of Pokemon objects.
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
                // Prints all Pokemon in the console
                console.log(pokemon);
            }); 
        }).catch(function (e) {
            console.error(e);
        })
    }

    // Could I change the name of the parameter item to pokemon as well?
    function loadDetails (item) {
        // Question: How can we use the detailsUrl key here? I thought one cannot use variables beyond the scope of a function, and detailsUrl was defined within the loadList() function.
        let url = item.detailsUrl;
        return fetch(url).then (function (response) {
            return response.json();
        }). then (function (details) {
            // Adding details to the item (parameter of the loadDetails() function) by defining (item object-keys?) variables (Question: Why is let not necessary here?)
            // .sprites/front_default etc. keys originate in the API. Sprites are collections of images put into a single image.
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            // Something to think about from the video, how to extract an array of types from the API type information. Create a forLoop tha iterate throught the API types object to push just the types into an empty array of types and then display to the user.
            item.types = details.types;
        }).catch (function (e) {
            console.error(e);
        });
    }

    return {
        add: add,
        filterPokemons: filterPokemons,
        getAll: getAll,
        addListPokemon: addListPokemon,
        loadList: loadList,
        loadDetails: loadDetails,
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