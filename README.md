# D.O.G.E
### -- Data Object Generation Engine

## TODOs

- 目前这种写法是有效的，需要做括号闭合检测：
  ```javascript

  let a = `{ foo: -raw }}}`

  // 但下面的写法是合法的
  let c = `[{ foo: { bar: -raw } }]`

  ```
