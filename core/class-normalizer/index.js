const {findByProps} = require('../webpack')

const reg = /((?<=ey-)[a-zA-Z0-9]*)/g
module.exports = function(css) {
    const array = css.match(/(ey-[a-zA-Z0-9]*)/g)
    if (array !== null) {
        array.forEach((m) => {
            const prop = m.match(reg)
            css = css.replace(m, '.' + findByProps(prop)[prop])
        })   
    }
    return css
}

//old thing 
// const toNormalize = [
// 'historyButtons'
// ]

// function finder(m) {
//     const obfuscatedClass = findByProps(m)[m]
//     console.log(m, obfuscatedClass)
//     const nodes = document.querySelectorAll('.' + obfuscatedClass)
//     if (nodes !== null){
//     nodes.forEach((n) => {
//         n.classList.add(m)
//         console.log(n)
//     })
//     }
//     else {
//         setTimeout(() => {
//             finder(m)
//         }, 100);
//     }
// }
// setTimeout(() => {
//     toNormalize.forEach(finder) 
// }, 1000); 