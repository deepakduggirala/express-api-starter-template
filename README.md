# Express API Starter Template

Features:
- Uses [pnpm](https://pnpm.io/)
- global error handler
- async error handler
- body parser, cookie parser, compression
- logger
    - log incoming requests
    - multi-level logger: ex: `logger.info()`
- hierarchical configuration
- CORS

Developer Exprience
- Auto reload:  `nodemon index.js`
- Linting
    - auto highligt linting errors
    - format on save
- Consistent Coding styles with editorconfig

Production deployment:
- pm2

Assumptions:
- there is a reverse proxy which handles security headers (this code is not using `helmet` module).

Source:
- https://github.com/danielfsousa/express-rest-boilerplate
- https://github.com/w3cj/express-api-starter/tree/main/src
- https://github.com/rzgry/Express-REST-API-Template

### Starter Template
- `pnpm init`
- `pnpm install express cookie-parser http-errors cors compression`
- `pnpm install nodemon --save-dev`

files 
- `app.js` - create and configure express application
- `index.js` - import app and start
- `routes/index.js` - main router
- `routes/user.js` - user routes
- `middleware.js` - error handlers
- `logger.js` - winston logger
- `config/*.json` - hierarchical configuration

### Error Handling
Source:
- https://expressjs.com/en/guide/error-handling.html
- https://github.com/jshttp/http-errors

```bash
pnpm install http-error
```

- Express automatically handles errors thrown in the synchronous code, however it cannot catch errors thrown from asynchronous code (in versions below 5). These have to caught and passed to the `next` function.
- The error thrown from the sync code are handled and passed to `next`
- When `next` is called with any argument except `'route'`, express assumes it is due to an error and skips any remaining non-error handling routing and middleware functions.

The default error handler:
- The default error handler is added at the end of the middleware function stack
- The `res.statusCode` is set from `err.status` (or `err.statusCode`). If this value is outside the 4xx or 5xx range, it will be set to 500.
- The `res.statusMessage` is set according to the status code.
- The body will be the HTML of the status code message when in production environment, otherwise will be `err.stack`. (environment variable NODE_ENV=production)
- Any headers specified in an `err.headers` object.

#### http-errors module:
- Helps to create http specific error objects which can be thrown or passed to next
```javascript
err = createError(404, 'user not found')
return next(err)
```
- Provides list of constructors to make the code readable - https://github.com/jshttp/http-errors

```javascript
return next(createError.NotFound())
```
this will automatically set correct error message based on the constructor.

#### Custom error handler
```javascript
const createError = require('http-error')

function errorHandler(err, req, res, next) {
  // delegate to the default Express error handler, when the headers have already been sent to the client
  if (res.headersSent) {
    return next(err)
  }
  if(err.status !== 404) {
    console.error(err);
  }
  if (err.expose === true) {
    res.status(err.status || 500).send(err);
  } else {
    res.status(500).send(createError.InternalServerError());
  }
}
```
- Logs error to console
- send actual message to client only if `err.expose` is true otherwise send a generic Internal server error.  For http errors such as (`throw createError(400, 'foo bar')`), the client receives `{"message":"foo bar"}` with status code to 400.
- For non http errors such as  `throw new Error('business logic error')`, only the `err.message` is set others are not. For such error, this handler will send a generic message. Client's will not see `business logic error` in thier response object.
- Does not log to console for 404 errors

#### 404 handler
```javascript
// catch 404 and forward to error handler
function notFound(req, res, next) {
  const error = createError(404, `Not Found - ${req.originalUrl}`);
  next(error);
}
```

### Authentication and Authorization
```javascript
app.use(function (req, res, next) {
  if (!req.user) return next(createError(401, 'Please login to view this page.'))
  next()
})
```

### CORS

```bash
pnpm install cors
```

### Logging
#### Log incoming requests

```bash
pnpm install morgan
```

morgan  library - https://github.com/expressjs/morgan

In app.js
```javascript
const requestLogger = require('morgan');

app.use(requestLogger('dev'));
```
dev is one of the predefined format-strings that defines how the log entry is formatted.

#### Custom logger

```bash
pnpm install winston
```



### Linting

Use Eslint

```bash
pnpm install eslint eslint-plugin-import eslint-config-airbnb-base --save-dev
```

Configure: create a `.eslintc` file with the below content

```json
{
  "rules": {
    "no-console": 0,
    "no-underscore-dangle": 0,
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    "no-use-before-define": ["error", { "variables": false }],
    "no-multi-str": 0
  },
  "env": {
    "node": true,
    "mocha": true
  },
  "parserOptions": {
    "ecmaVersion": 8
  },
  "extends": [
    "airbnb-base"
  ]
}
```

Configure vscode to format and fix error on save:
- In` .vscode/settings.json` add these:

```json
"prettier.enable": false,
"editor.codeActionsOnSave": {
"source.fixAll.eslint": true
},
"eslint.validate": ["javascript"],
"editor.formatOnSave": false,
```

### Config

```bash
pnpm install config
```
Use `config` module - https://github.com/node-config/node-config

Configurations are stored in [configuration files](https://github.com/node-config/node-config/wiki/Configuration-Files) within your application, and can be overridden and extended by [environment variables](https://github.com/lorenwest/node-config/wiki/Environment-Variables), [command line parameters](https://github.com/node-config/node-config/wiki/Command-Line-Overrides), or [external sources](https://github.com/lorenwest/node-config/wiki/Configuring-from-an-External-Source).


create `default.json`, `production.json`, `custom-environment-variables.json` files in `./config/` directory.
- precdence of config: command line > environment > {NODE_ENV}.json > default.json

The properties to read and override from environment is defined in `custom-environment-variables.json`