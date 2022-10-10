const prettierOptions = require('./.prettierrc.cjs');

module.exports = {
  plugins: ['@typescript-eslint', 'eslint-comments', 'prettier'],
  extends: ['airbnb-base', 'airbnb-typescript', 'plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking', 'prettier'],
  env: {
    node: true,
    browser: true,
    jest: false
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // allows continue in for loops
    'no-continue': 'off',
    // Do not allow function expressions and with statements
    'no-restricted-syntax': ['error', 'WithStatement'],
    // Stupid rule, forcing `this` into any class methods
    'class-methods-use-this': 'off',
    // this rule is very annoying if you're in the middle of writing the component and it changes
    'arrow-body-style': 'off',
    // It's not accurate in the monorepo style
    'import/no-extraneous-dependencies': 'off',
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    'import/prefer-default-export': 'off',
    // bullshit rule
    'max-classes-per-file': 'off',
    // we do it a lot in reducers
    'no-param-reassign': 'off',
    // used a lot in for loops
    'no-plusplus': 'off',
    'import/no-cycle': 'off',
    'react/jsx-filename-extension': 'off',
    // env variables
    'no-underscore-dangle': 'off',
    'prefer-destructuring': [1],
    'prettier/prettier': [2, prettierOptions],
    // Allow us to use ts-ignore
    '@typescript-eslint/ban-ts-comment': 'off',
    // Allow most functions to rely on type inference. If the function is exported, then `@typescript-eslint/explicit-module-boundary-types` will ensure it's typed.
    '@typescript-eslint/explicit-function-return-type': 'off',
    // we usually have class fields one after another without linebreal
    '@typescript-eslint/lines-between-class-members': 'off',
    // TODO: Temporarily filter our env variable names. A solution for that would be to introduce common service that encapsulates them with proper names
    '@typescript-eslint/naming-convention': ['error', {
      selector: 'variable',
      format: null,
      filter: {
        regex: '__.*__',
        match: true
      }
    }],
    // dispatch returns promise which we often do not await since they are handled by redux thunks
    '@typescript-eslint/no-floating-promises': 'off',
    // it screams when we assign async function as React prop which is very common
    '@typescript-eslint/no-misused-promises': 'off',
    // for some reason it shows up for every method related with redux toolkit
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    // breakes for 'style' objects from css modules
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    // we're not that strict with typing
    '@typescript-eslint/no-unsafe-return': 'off',
    // we're taking advantage of hoisting so that rule is kind of irrelevant
    '@typescript-eslint/no-use-before-define': 'off',
    // throws an error when we want to e.g log "object?.value"
    '@typescript-eslint/restrict-template-expressions': 'off',
    // allow explicit any
    '@typescript-eslint/no-explicit-any': 'off',
    // ensure that there is at least one 'expect' call made in test - Cypress doesn't use expect
    'jest/expect-expect': 'off'
  }
};