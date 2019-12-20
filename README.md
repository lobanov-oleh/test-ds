# test-ds

## What I use

### [JavaScript Standard Style](https://github.com/standard)

There is more information about TypeScript under JavaScript Standard Style: [eslint-config-standard-with-typescript](https://github.com/standard/eslint-config-standard-with-typescript)

### Non-relative import

```ts
import v1 from '@api/v1'
```

instead of:

```ts
import v1 from '../src/api/v1'
```

The bunch of the following modules makes this possible:
* [tsconfig-paths](https://github.com/dividab/tsconfig-paths) for development
* [module-alias](https://github.com/ilearnio/module-alias) for production

### [dirty-chai](https://github.com/prodatakey/dirty-chai)

See [test/chai.ts](test/chai.ts)

## Getting started

```
git clone git@github.com:lobanov-oleh/test-ds.git
cd test-ds
npm i
npm run build
npm start
```

or 

```
npm test
```
