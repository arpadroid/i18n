module.exports = {
    verbose: true,
    coverageReporters: ['html', 'text', 'cobertura'],
    testEnvironment: 'jsdom',
    testMatch: ['**/__tests__/**/*.?(m)js?(x)', '**/?(*.)(spec|test).?(m)js?(x)'],
    moduleFileExtensions: ['js', 'mjs'],
    transform: {
        '^.+\\.m?js$': 'babel-jest'
    },
    fakeTimers: { enableGlobally: true },
    globals: {},
    injectGlobals: true,
    setupFilesAfterEnv: ['<rootDir>/node_modules/@arpadroid/module/src/jest/jest.setup.cjs'],
    transformIgnorePatterns: ['node_modules/(?!@arpadroid/tools)'],
    reporters: [
        'default',
        [
            'jest-junit',
            {
                // outputDirectory: "",
                outputName: 'junit.xml'
            }
        ]
    ]
};
