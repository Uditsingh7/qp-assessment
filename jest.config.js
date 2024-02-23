module.exports = {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "clearMocks": true,
    "coverageDirectory": "coverage",
    "collectCoverage": true,
    "collectCoverageFrom": [
        "src/**/*.ts",
        "!src/**/*.test.ts",
        "!**/node_modules/**"
    ]
}

