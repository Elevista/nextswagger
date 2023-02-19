# NexTSwagger
Next-TS-Swagger plugin generator CLI

[![npm package](https://img.shields.io/npm/v/nextswagger.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/nextswagger)
[![github stars](https://img.shields.io/github/stars/Elevista/nextswagger?style=social)](https://github.com/Elevista/nextswagger)

## Installation
```sh
npm i -D nextswagger
```

## Requirements
- [`Next`](https://nextjs.org) base project
- [`axios`](https://www.npmjs.com/package/axios) module

## Basic Usage
in Next project directory
```sh
npx nextswagger https://api.server.foo/swagger.json
```
in component
```js
import {api} from './api'
const foo = await api().bar.get()
```

### Path param mode

*see `form` option*

```js
/* default (1.1.0+) */
api().foo.bar(1).get(2)
api().foo.bar.get()

/* underscore */
api().foo._bar.get(1, 2)
api().foo.bar.get()
```

## Options

options priority : command line > `next.config` > `package.json`

```sh
nextswagger argument1 --option1 value1 --option2 value2
```

| option           | description                | default                                  | example                             |
|------------------|----------------------------|------------------------------------------|-------------------------------------|
| (first argument) | Swagger schema JSON path   | (required)                               | `http://..` or `./foo/swagger.json` |
| `src`            | same as first argument     | first argument                           | same as above                       |
| `plugins-dir`    | Directory                  | `lib`                                    |                                     |
| `plugin-name`    | Name for generated flile   | `api`                                    |                                     |
| `export-name`    | Export name                | `{plugin-name}`                          | `''`(export default)                |
| `type-path`      | Path for scheme type file  | `{plugins-dir}/{plugin-name}/{types.ts}` | `./types/models.ts`                 |
| `base-path`      | base path                  | `/v1`                                    | `/v2`                               |
| `skip-header`    | Ignore parameter in header | `false`                                  | `true`                              |
| `form`           | Path param interface mode  | (undefined)                              | `underscore`                        |

### Set options using `next.config`

```ts
import { NextConfig } from 'nextswagger'
const config: NextConfig = {
  serverRuntimeConfig: {
    nextswagger: [
      { pluginName: 'foo', src: 'https://api.server.foo/swagger.json' },
      { pluginName: 'bar', src: 'https://api.server.bar/swagger.json' }
    ]
  },
  publicRuntimeConfig: {
    nextswagger: {
      pluginName: 'foo',
      // AxiosRequestConfig?
      axiosConfig: { baseURL: 'https://api-stage.server.foo' }
    }
  },
}
export default config
```

### Set options using `package.json`
```json
{
  "nextswagger": {
    "pluginsDir": "api"
  }
}
```

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["nextswagger/types"]
  }
}
```



and `npm run swagger` or `npx nextswagger`


## License
ISC License
Copyright (c) 2023, Elevista
