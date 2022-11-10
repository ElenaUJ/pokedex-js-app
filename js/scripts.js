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
]

// Print list of Pokemon with their respective heights in the HTML file. 

// Definition of printList function that should be looped over each array item (printing Pokemon details, adding 'Wow, that's big' to any Pokemon which is equal or higher than 1.5 m)
function printList(pokemon) {
    if (pokemon.height >= 1.5) {
        document.write('<h2>' + pokemon.name + '</h2><p> height: ' + pokemon.height + ' m</p><p style="color: #CC0000">Wow, that\'s big!</p>');
    } else {
        document.write('<h2>' + pokemon.name + '</h2><p> height: ' + pokemon.height + ' m</p>');
    }
}
//calling the forEach method to run printList for every array item of the pokemonList array. ForEach method takes functions as arguments.
pokemonList.forEach(printList);
