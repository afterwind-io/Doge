cd ../node_modules/.bin

istanbul.cmd cover --report text --report lcov --color ./mocha.cmd -- -c
