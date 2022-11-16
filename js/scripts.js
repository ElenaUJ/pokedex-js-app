// The array pokemonList is wrapped in an IIFE function to make its elements inaccessible from the outside. Exception: the two well-defined keys that are returned by the IIFE function.
let pokemonRepository = (function() {

    // Array definition
    let pokemonList = [
        {
            name: 'Pikachu', 
            height: 0.4, 
            type: ['electric']
        },
        {
            name: 'Mew', 
            height: 0.4, 
            type: ['psychic']
        },
        {
            name: 'Psyduck', 
            height: 0.8, 
            type: ['water']
        },
        {
            name: 'Jigglypuff', 
            height: 0.5, 
            type: ['fairy', 'normal']
        },
        {
            name: 'Charizard', 
            height: 1.7, 
            type: ['fire', 'flying']
        },
        {
            name: 'Eevee', 
            height: 0.3, 
            type: ['normal']
        },
        {
            name: 'Cinderace', 
            height: 1.4, 
            type: ['fire']
        }
    ];
    
    // Function declarations are not ended with a semicolon, because they are not executable statements.
    // Is it ok that the parameter is called pokemon here and in the filter function, even though in the forEach loop the parameter is called the same? Or shall I use another name for the parameter here
    // When and how will this actually be used?
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
            // Why does it not work to use pokemon.name here? Are object keys not valid parameters?
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
        // Adding classs="button" to listItem. Specific CSS style for this class defined in CSS stylesheet.
        button.classList.add('button');
        // Appending button to listItem as its child.
        listPokemon.appendChild(button);
    
        // Appending listItem to pokemonList as its child.
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

// Declaration of the function that should be looped over each array item. addListPokemon() function is called within the function declaration (correct?). Parameter of the printList() function has to be the same as the addListPokemon()'s arguments.
function printList(pokemon) {
    pokemonRepository.addListPokemon(pokemon);
}
// Calling the forEach method to run the addListPokemon function for every array item of the pokemonList array. (Has to be accessed by calling the getAll() function.) ForEach method takes functions as arguments.
pokemonRepository.getAll().forEach(printList);