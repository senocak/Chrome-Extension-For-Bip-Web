module.exports = {
    "roots": [
        "src"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.test.json" }]
    },
    "testEnvironment": "jsdom",
    "moduleNameMapper": {
        "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js"
    },
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"],
    "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"],
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$"
}; 
