# D.O.G.E
### -- Data Object Generation Engine

## TODOs

- 目前这种写法是有效的，需要做括号闭合检测：
  ```javascript

  let a = `{ foo: -raw }}}`

  // 但下面的写法是合法的
  let c = `[{ foo: { bar: -raw } }]`

  ```

- raw关键字在处理时导致很多特例情况发生，是否替换至：
  ```javascript

  let a = `{ foo: -in($raw) }`

  ```