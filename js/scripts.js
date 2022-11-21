// The array pokemonList is wrapped in an IIFE function to make its elements inaccessible from the outside. Exception: the two well-defined keys that are returned by the IIFE function.
let pokemonRepository = (function() {

    // Array definition (empty), becaue Pokemons will be pushed from API
    let pokemonList = [];

    
    // Function declarations are not ended with a semicolon, because they are not executable statements.
    // This function will be used when Pokemons can be added without hardcoding the values.
    function add(pokemon) { 
        // Validation of input type: Has to be an object which contains the keys name, height and type
        if (typeof pokemon === 'object' 
        && Object.keys(pokemon).includes('name' && 'height' && 'type')) {
            // .push method adds elements to the end of the array
            pokemonList.push(pokemon);
        } else {
            console.error('Pokémon has to be added using this format: {name:, height:, type: []}')
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
    return {
        add: add,
        filterPokemons: filterPokemons,
        getAll: getAll,
        addListPokemon: addListPokemon
    };

// The IIFE function is self-executing, hence why it ends with parentheses
})();

// Declaration of the function that should be looped over each array item. addListPokemon() function is called within the function declaration. Parameter of the printList() function has to be the same as the addListPokemon()'s arguments.
function printList(pokemon) {
    pokemonRepository.addListPokemon(pokemon);
}
// Calling the forEach method to run the addListPokemon function for every array item of the pokemonList array. (Has to be accessed by calling the getAll() function.) ForEach method takes functions as arguments.
pokemonRepository.getAll().forEach(printList);