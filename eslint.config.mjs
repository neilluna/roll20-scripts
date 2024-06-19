// import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
    pluginJs.configs.recommended,
    {
        languageOptions: {
            // globals: globals.browser
            globals: {
                "Campaign": "readonly",
                "createObj": "readonly",
                "findObjs": "readonly",
                "getObj": "readonly",
                "log": "readonly",
                "on": "readonly",
                "playerIsGM": "readonly",
                "sendChat": "readonly",
                "sendPing": "readonly",
                "spawnFx": "readonly",
                "stringOrBlank": "readonly",
                "state": "readonly",
                "toFront": "readonly",
            },
        },
        plugins: {
            '@stylistic/js': stylisticJs,
        },
        rules: {
            "@stylistic/js/comma-dangle": ["error", {
                "arrays": "always-multiline",
                "objects": "always-multiline",
                "imports": "always-multiline",
                "exports": "always-multiline",
                "functions": "always-multiline",
            }],
            "@stylistic/js/linebreak-style": ["error", "unix"],
            "no-var": "error",
            "prefer-const": ["error", {
                "destructuring": "any",
                "ignoreReadBeforeAssign": false,
            }],
            "@stylistic/js/semi": ["error", "always"],
        },
    },
];
