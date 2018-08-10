'use strict';

const jest = require('jest');
const merge = require('lodash.merge');

const defaultConfig = {
  collectCoverageFrom: ['src/**/*.js'],
  setupFiles: [require.resolve('./config/setup')],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.js?(x)',
    '<rootDir>/**/?(*.)(spec|test).js?(x)',
    '<rootDir>/**/?(*-)(spec|test).js?(x)',
  ],
  transform: {
    '^.+\\.(js|jsx)$': require.resolve('./config/jsTransform.js'),
    '^.+\\.css$': require.resolve('./config/cssTransform.js'),
    '^(?!.*\\.(js|jsx|css|json)$)': require.resolve(
      './config/fileTransform.js'
    ),
  },
  testPathIgnorePatterns: ['/cjs/', '/dist/', '/es/', '/lib/'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleFileExtensions: ['js', 'json'],
};

module.exports = ({ api, options }) => {
  api.extend('jest', () => defaultConfig);

  api.addCommand({
    name: 'test',
    description: "run your application's tests using jest",
    allowUnknownOption: true,
    options: [
      {
        flags: '--help',
        description: 'Get help for command',
      },
    ],
    async action() {
      const jestConfig = await api.read('jest');
      const config = merge(jestConfig, options);
      const args = process.argv.slice(3);
      const cliArgs = args.concat('--config', JSON.stringify(config));

      if (args.includes('--help')) {
        return jest.run(args);
      }

      return jest.run(cliArgs);
    },
  });

  api.add(async ({ extendPackageJson }) => {
    console.log('adding script...');
    // await extendPackageJson(({ cliPath, packageJson }) => ({
    // scripts: {
    // ...packageJson.scripts,
    // test: `${cliPath} test`,
    // },
    // }));
  });
};
