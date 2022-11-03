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

/* To display list of Pokemon with their respective heights in the HTML file. 
Loop: let i = 0 initialized loop at first arrax index; i < pokemonList.length makes sure loops stops at last array-index; pokemonList[i].name refers to the respective pokemon's (object's) name (key-value)
Condition: If Pokemon height equals or is larger than 1.5, it will be pointed out using modified string; \is used to hide single quote in "that's"  */
for (let i = 0; i < pokemonList.length; i++) {
    if (pokemonList[i].height >= 1.5) {
        document.write('<h2>' + pokemonList[i].name + '</h2><p> height: ' + pokemonList[i].height + ' m</p><p style="color: #CC0000">Wow, that\'s big!</p>');
    } else {
        document.write('<h2>' + pokemonList[i].name + '</h2><p> height: ' + pokemonList[i].height + ' m</p>');
    }
}
