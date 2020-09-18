const {findByProps} = require('../webpack')
const toNormalize = [
'historyButtons'
]

function finder(m) {
    const obfuscatedClass = findByProps(m)[m]
    console.log(m, obfuscatedClass)
    const nodes = document.querySelectorAll('.' + obfuscatedClass)
    if (nodes !== null){
    nodes.forEach((n) => {
        n.classList.add(m)
        console.log(n)
    })
    }
    else {
        setTimeout(() => {
            finder(m)
        }, 100);
    }
}
setTimeout(() => {
    toNormalize.forEach(finder) 
}, 1000); 