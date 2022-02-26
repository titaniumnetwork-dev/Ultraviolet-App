# Ultraviolet
Ultraviolet application

[![Deploy to Heroku](https://raw.githubusercontent.com/BinBashBanana/deploy-buttons/master/buttons/remade/heroku.svg)](https://heroku.com/deploy/?template=https://github.com/titaniumnetwork-dev/uv-app)
[![Run on Replit](https://raw.githubusercontent.com/BinBashBanana/deploy-buttons/master/buttons/remade/replit.svg)](https://replit.com/github/titaniumnetwork-dev/uv-app)

# Steps
Installing on machine

```
git clone https://github.com/titaniumnetwork-dev/ultraviolet-node/
cd ultraviolet-node
git submodule update --init
npm install
npm start
```
On Repl, make sure to run the `git submodule update --init` command in shell.

`http://localhost:8080/`

Change server address properties when desired. 

# Updating Bare
```
git submodule update --remote
```

However, this may override files in `static/` so be careful.

# Ultraviolet Config
`uv.config.js`

```javascript
self.__uv$config = {
    prefix: '/sw/', // Proxy url prefix
    bare: '/bare/', // Bare server location
    encodeUrl: Ultraviolet.codec.xor.encode, // URL Encoding function
    decodeUrl: Ultraviolet.codec.xor.decode, // Decode URL function
    handler: '/uv.handler.js', // Handler script
    bundle: '/uv.bundle.js', // Bundled script
    config: '/uv.config.js', // Configuration script
    sw: '/uv.sw.js', // Service Worker Script
};
```
