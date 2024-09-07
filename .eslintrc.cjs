// /* eslint-env node */
// require('@rushstack/eslint-patch/modern-module-resolution');

// module.exports = {
//   root: true,
//   extends: [
//     'plugin:vue/vue3-essential',
//     'eslint:recommended',
//     'plugin:prettier-vue/recommended',
//     '@vue/eslint-config-typescript',
//     '@vue/eslint-config-prettier/skip-formatting'
//   ],
//   parserOptions: {
//     ecmaVersion: 'latest'
//   },
//   rules: {
//     // eslint
//     'eol-last': 'error',

//     // vue
//     'vue/component-name-in-template-casing': 'error',
//     'vue/html-closing-bracket-newline': 'error',
//     'vue/multiline-html-element-content-newline': [
//       'error',
//       {
//         ignores: ['pre', 'textarea']
//       }
//     ],
//     'vue/multi-word-component-names': 'off',

//     // typescript
//     '@typescript-eslint/indent': 'off',
//     '@typescript-eslint/no-non-null-assertion': 'off',
//     '@typescript-eslint/no-explicit-any': 'off'
//   }
// };

/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential', // 保持基本的 Vue 檢查
    'eslint:recommended', // 保持基本的 ESLint 檢查
    '@vue/eslint-config-typescript', // TypeScript 支持
    '@vue/eslint-config-prettier/skip-formatting' // 確保 Prettier 不會強制格式化
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // 關閉不必要的檢查，或將其設為警告級別
    'eol-last': 'off', // 關閉文件結尾換行的檢查
    'no-unused-vars': 'warn', // 將未使用的變量設為警告

    // 關閉或放寬 Vue 特定規則
    'vue/component-name-in-template-casing': 'off', // 關閉模板中組件名稱大小寫檢查
    'vue/html-closing-bracket-newline': 'off', // 關閉 HTML 閉合標籤換行檢查
    'vue/multiline-html-element-content-newline': 'off', // 關閉多行 HTML 內容的換行檢查
    'vue/multi-word-component-names': 'off', // 關閉多詞組件名稱檢查

    // 放寬 TypeScript 規則
    '@typescript-eslint/indent': 'off', // 關閉縮進檢查
    '@typescript-eslint/no-non-null-assertion': 'off', // 關閉非空斷言檢查
    '@typescript-eslint/no-explicit-any': 'off' // 允許使用 `any` 類型
  }
};
