module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  // La configuración apunta al stack real del frontend: navegador, Node para tooling y JSX moderno.
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
  // Se parte de reglas recomendadas y luego se relajan solo las que hoy bloquearían el taller.
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
