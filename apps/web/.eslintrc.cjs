module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  plugins: ["react", "react-hooks"],
  ignorePatterns: ["dist/", "node_modules/"],
  rules: {
    // React 17+ no requiere importar React en cada archivo JSX.
    "react/react-in-jsx-scope": "off",
    // Se permite durante el taller para no bloquear por tipado de props.
    "react/prop-types": "off",
  },
};