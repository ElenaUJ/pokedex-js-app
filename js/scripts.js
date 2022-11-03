let pokemonList = [
    {
        name: 'Pikachu', 
        height: 0.4, 
        types: ['electric']
    },
    {
        name: 'Mew', 
        height: 0.4, 
        types: ['psychic']
    },
    {
        name: 'Psyduck', 
        height: 0.8, 
        types: ['water']
    },
    {
        name: 'Jigglypuff', 
        height: 0.5, 
        types: ['fairy', 'normal']
    },
    {
        name: 'Eevee', 
        height: 0.3, 
        types: ['normal']
    },
    {
        name: 'Cinderace', 
        height: 1.4, 
        types: ['fire']
    },
    {
        name: 'Charizard', 
        height: 1.7, 
        types: ['fire', 'flying']
    }
]

for (let i = 0; i < pokemonList.length; i++) {
    document.write('<p>' + pokemonList[i].name + ' (height: ' + pokemonList[i].height + ' m)</p>');
}