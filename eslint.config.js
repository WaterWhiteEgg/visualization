import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import vueTsParser from "@typescript-eslint/parser";

export default [
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      /* 指定如何解析语法 */
      parser: vueParser,
      parserOptions:{
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: vueTsParser,
        jsxPragma: 'React',
        ecmaFeatures: {
          jsx: true,
        },
      }
    },

    // languageOptions: {
    //   ecmaVersion: "latest",
    //   sourceType: "module",
    //   parser: "@typescript-eslint/parser",
    //   jsxPragma: "React",
    //   ecmaFeatures: {
    //     jsx: true,
    //   },
    // },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
];
