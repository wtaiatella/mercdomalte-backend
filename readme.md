Projeto base NODE + WEBPACK + TYPESCRIPT

Dependência instaladas e funcionando:

    	"dotenv": "^16.0.1",
    	"express": "^4.18.1",
    	"fork-ts-checker-notifier-webpack-plugin": "^6.0.0",
    	"fork-ts-checker-webpack-plugin": "^7.2.8",
    	"nodemon": "^2.0.19",
    	"npm-run-all": "^4.1.5",
    	"pino": "^8.3.1",
    	"prettier": "2.6.2",
    	"rimraf": "^3.0.2",
    	"ts-loader": "^9.2.9",
    	"tslib": "^2.4.0",
    	"typescript": "^4.7.4",
    	"webpack": "^5.72.0",
    	"webpack-cli": "^4.9.2",
    	"webpack-dev-server": "^4.8.1"

Dependências DEV
"@typescript-eslint/eslint-plugin": "^5.21.0",
"@typescript-eslint/parser": "^5.21.0",
"@types/express": "^4.17.13",
"eslint": "^8.14.0",
"eslint-config-prettier": "^8.5.0",
"webpack-node-externals": "^3.0.0"

Scripts configurados em package.json:
"start": "webpack --mode=development",
"prebuild": "rimraf ./dist/\*",
"build": "webpack --mode=production",
"server": "node ./dist/server.js",
"prod": "NODE_ENV=production npm-run-all prebuild build",
"dev": "NODE_ENV=development npm-run-all prebuild start server",
"killport": "fuser -n tcp -k 5900",
"lint": "eslint ./src"

Config do tsconfig.json
"compilerOptions": {
"rootDir": "./",
"paths": {
"@src/_": ["./src/_"],
"@tests/_": ["./tests/_"]
},

    	"target": "ES6",
    	"lib": ["es6"],
    	"module": "commonjs",
    	"moduleResolution": "node",
    	"resolveJsonModule": true,
    	"sourceMap": true,
    	"allowJs": true,
    	"outDir": "build",
    	"removeComments": true,
    	"esModuleInterop": true,
    	"importHelpers": true,
    	"forceConsistentCasingInFileNames": true,
    	"strict": true,
    	"noImplicitAny": true,
    	"skipLibCheck": true
    },
    "exclude": ["node_modules", "dist"],
    "include": ["src"]
