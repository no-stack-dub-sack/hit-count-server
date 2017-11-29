
/** IF CALLED FROM registerCount, CASES ARE:
  * 'http://cs-playground-react.surge.sh/'
  * 'https://cs-playground-react.surge.sh/'
  * 'http://peterweinberg.me/'
/** IF CALLED FROM getCount, CASES ARE:
  * 'cs-playground-react'
  * 'portfolio'
  */

// for registerCount, we only care about this
// if cs-playground-react is being accessed
// over https, we lookup the record by host
// & is stored as http://cs-playground-react
// we must reassign to retrieve right record

const hostName = (str) => {
  switch (str) {
    case 'https://cs-playground-react.surge.sh/':
    case 'cs-playground-react':
      return 'http://cs-playground-react.surge.sh/';
    case 'portfolio':
      return 'http://peterweinberg.me/';
    default:
      return str;
  }
}

// TOGGLE FOR DEV
// const hostName = (str) => {
//   switch (str) {
//     case 'https://cs-playground-react.surge.sh/':
//       return 'http://cs-playground-react.surge.sh/';
//     case 'cs-playground-react':
//       return 'http://localhost:3000/'
//     case 'portfolio':
//       return 'http://localhost:3001/';
//     default:
//       return str;
//   }
// }

module.exports = hostName;
