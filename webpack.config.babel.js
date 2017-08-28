
const { resolve } = require('path');
const webpack = require('webpack');
const { name } = require('./package.json');
const camelcase = require('lodash.camelcase');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// const isDev = process.env.NODE_ENV === 'development';

const PROJECT_PATH = __dirname;
const inProject = (...args) => resolve(PROJECT_PATH, ...args);
const inSrc = inProject.bind(null, 'src');
const inTest = inProject.bind(null, 'test');
const srcDir = inSrc();
const testDir = inTest();

module.exports = (webpackEnv = {}) => {
	const { minify } = webpackEnv;

	const config = {
		devtool: 'source-map',
		entry: './src',
		output: {
			filename: `${name}${minify ? '.min' : ''}.js`,
			path: resolve(__dirname, 'dist'),
			library: camelcase(name),
			libraryTarget: 'umd',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [srcDir, testDir],
					loader: 'babel-loader',
					options: {
						presets: [
							['es2015', { modules: false }],
							'react',
							'stage-0',
						],
						plugins: [
							'transform-decorators-legacy',
						],
						cacheDirectory: true,
						babelrc: false,
					},
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			}),
		],
		resolve: {
			modules: ['node_modules'],
			extensions: ['.js'],
		},
		resolveLoader: {
			moduleExtensions: ['-loader'],
		},
		externals: {
			react: 'React',
			'react-dom': 'ReactDom',
			'react-router': 'ReactRouter',
			mobx: 'mobx',
		},
	};

	if (minify) {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
		);
	}

	return config;
};
