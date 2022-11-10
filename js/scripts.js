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
    
    // Sahil: Is it ok that the parameter is called pokemon, even though in the forEach loop the parameter is called the same? Or shall I use another name for the parameter here
    function add(pokemon) { 
        // Validation of input type: Has to be an object which contains the keys name, height and type
        if (typeof pokemon === 'object'
        && Object.keys(pokemon).includes('name' && 'height' && 'type')) {
        // .push method adds elements to the end of the array
        pokemonList.push(pokemon);
        // No else statement necessary for now?
        }
    }

    function getAll() {
        return pokemonList;
    }

    // Return a new object with two keys that penetrate the IIFE: add and getAll. Since add and getAll have the same names for key and value, I could also just write add, getAll
    return {
        add: add,
        getAll: getAll
    };

// The IIFE function is self-executing, hence why it ends with parentheses
})();

// Definition of printList function that should be looped over each array item (printing Pokemon details, adding 'Wow, that's big' to any Pokemon which is equal or higher than 1.5 m)
function printList(pokemon) {
    if (pokemon.height >= 1.5) {
        document.write('<h2>' + pokemon.name + '</h2><p> height: ' + pokemon.height + ' m</p><p style="color: #CC0000">Wow, that\'s big!</p>');
    } else {
        document.write('<h2>' + pokemon.name + '</h2><p> height: ' + pokemon.height + ' m</p>');
    }
}
//  Calling the forEach method to run printList for every array item of the pokemonList array. (Has to be accessed by calling the getAll() function.) ForEach method takes functions as arguments.
pokemonRepository.getAll().forEach(printList);