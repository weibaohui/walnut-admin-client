module.exports = {
  '*.{js,jsx,ts,tsx}': ['npm run lint:eslint', 'npm run lint:prettier'],
  '*.vue': ['npm run lint:prettier'],
  '*.{css,scss,less,styl}': ['npm run lint:prettier', 'npm run lint:stylelint'],
}
