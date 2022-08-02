/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
require('dotenv').config();

const { NODE_ENV = 'production' } = process.env;

module.exports = {
	context: __dirname, // to automatically find tsconfig.json
	entry: {
		main: './src/server.ts',
	},
	mode: NODE_ENV,
	target: 'node', // webpack works differently based on target, here we use node.js
	// in order to ignore built-in modules like path, fs, etc.
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'server.js',
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			// provider any import aliases you may use in your project
			src: path.resolve(__dirname, 'src/'),
			'@controller': path.resolve(__dirname, 'src/controllers/'),
			'@service': path.resolve(__dirname, 'src/services/'),
			'@src': path.resolve(__dirname, 'src/'),
		},
	},
	module: {
		rules: [
			{
				test: /.tsx?$/,
				use: [
					{ loader: 'ts-loader', options: { transpileOnly: true } },
				],
				exclude: [
					// exclude any files you don't want to include, eg test files
					/__tests__/,
				],
			},
		],
	},
	externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
	plugins: [
		new ForkTsCheckerWebpackPlugin(),
		new ForkTsCheckerNotifierWebpackPlugin({
			title: 'TypeScript',
			excludeWarnings: false,
		}),
	],
	devServer: {
		port: process.env.PORT,
	},
};
