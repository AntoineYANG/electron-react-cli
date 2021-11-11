const origin = `/**
 * @type {import('eslint').Linter.BaseConfig & { rules: Record<string, 0 | "off" | 1 | "warn" | 2 | "error" | [0 | "off" | 1 | "warn" | 2 | "error", ...any[]]>; }}
 */
const eslintConfig = {
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: [
    "react",
    "@typescript-eslint"
  ],
  rules: {
    'accessor-pairs': [
      'error', {
        setWithoutGet: true
      }
    ],
    'array-bracket-newline': [
      'error', {
        "multiline": true,
        "minItems": 4
      }
    ],
    'array-bracket-spacing': [
      'error',
      'never', {
        singleValue: false,
        objectsInArrays: false,
        arraysInArrays: false
      }
    ],
    'array-callback-return': ['error'],
    'array-element-newline': [
      'error', {
        "multiline": true,
        "minItems": 4
      }
    ],
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': [
      'error', {
        "before": true,
        "after": true
      }
    ],
    'block-scoped-var': 'error',
    'block-spacing': ['error'],
    'brace-style': ['error'],
    'callback-return': [
      'error', [
        'callback',
        'cb',
        'next',
        'resolve',
        'reject'
      ]
    ],
    camelcase: [
      'error', {
        properties: "always"
      }
    ],
    'capitalized-comments': [
      'error',
      'always', {
        line: {
          ignorePattern: '.'
        },
        block: {
          ignorePattern: 'no',
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true
        }
      }
    ],
    'class-methods-use-this': [
      'error', {
        exceptMethods: [
          'constructor',
          'componentDidMount',
          'componentDidUpdate',
          'render',
          'componentDidCatch',
          'componentWillUnmount'
        ]
      }
    ],
    'comma-dangle': ['error', 'only-multiline'],
    'comma-spacing': [
      'error', {
        "before": false,
        "after": true
      }
    ],
    'comma-style': ['error', 'last'],
    complexity: ['error', 20],
    'computed-property-spacing': 'off',
    'consistent-return': 'error',
    'consistent-this': ['error', 'that'],
    'constructor-super': 'error',
    curly: ['error', 'all'],
    'default-case': [
      'error', {
        commentPattern: '/^[nN]o default( case)?$/'
      }
    ],
    'dot-notation': 'error',
    'eol-last': 'error',
    eqeqeq: 'error',
    'for-direction': 'error',
    'func-call-spacing': ['error', 'never'],
    'func-name-matching': 'off',
    'func-names': 'off',
    'func-style': [
      'error',
      'declaration', {
        allowArrowFunctions: true
      }
    ],
    'function-paren-newline': ['error', 'consistent'],
    'generator-star-spacing': [
      'error', {
        before: true,
        after: false
      }
    ],
    'getter-return': 'error',
    'global-require': 'off',
    'guard-for-in': 'error',
    'handle-callback-err': [
      'error',
      '^(err|error|reason)$'
    ],
    'id-length': [
      'error', {
        min: 1,
        max: 24
      } 
    ],
    'id-match': 'off',
    'implicit-arrow-linebreak': ['error', 'beside'],
    indent: [
      'error',
      2, {
        SwitchCase: 1,
        VariableDeclarator: {
          "var": 2,
          "let": 2,
          "const": 3
        },
        MemberExpression: 1,
        FunctionDeclaration: {
          body: 1,
          parameters: 'first'
        },
        CallExpression: {
          arguments: 'first'
        },
        ArrayExpression: 'first',
        ObjectExpression: 'first',
        ImportDeclaration: 'first',
        flatTernaryExpressions: true
      }
    ],
    'init-declarations': ['error', 'always'],
    'jsx-quotes': ['error', 'prefer-double'],
    'key-spacing': [
      'error', {
        multiLine: {
          beforeColon: false,
          afterColon: true,
          mode: 'minimum',
          align: 'value'
        }
      }
    ],
    'keyword-spacing': [
      'error', {
        before: true,
        after: true
      }
    ],
    'lines-between-class-members': [
      'error',
      'always', {
        exceptAfterSingleLine: true
      }
    ],
    'max-depth': ['error', 4],
    'max-len': [
      'error', {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreTrailingComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: false,
        ignoreRegExpLiterals: true
      }
    ],
    'max-lines': [
      'error', {
        max: 300,
        skipBlankLines: true,
        skipComments: true
      }
    ],
    'max-nested-callbacks': ['error', 3],
    'max-params': ['warn', 5],
    'max-statements': ['error', 40],
    'max-statements-per-line': [
      'error', {
        max: 2
      }
    ],
    'multiline-ternary': 'off',
    'new-cap': 'error',
    'new-parens': 'error',
    'no-alert': 'warn',
    'no-await-in-loop': 'error',
    'no-case-declarations': 'error',
    'no-class-assign': 'error',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': 'error',
    'no-confusing-arrow': [
      'error', {
        allowParens: true
      }
    ],
    'no-console': 'warn',
    'no-constant-condition': 'error',
    'no-control-regex': 'error',
    'no-debugger': 'error',
    'no-delete-var': 'error',
    'no-duplicate-case': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'warn',
    'no-empty': 'error',
    'no-empty-function': 'error',
    'no-empty-pattern': 'warn',
    'no-eval': 'error',
    'no-ex-assign': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-boolean-cast': 'error',
    'no-extra-label': 'error',
    'no-extra-semi': 'error',
    'no-fallthrough': [
      'error', {
        commentPattern: '/(falls? through)|(break omitted)/i'
      }
    ],
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-implied-eval': 'error',
    'no-invalid-regexp': 'error',
    'no-invalid-this': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'warn',
    'no-magic-numbers': [
      'error', {
        ignore: [
          -1,
          0,
          1,
          2,
          3,
          4,
          10,
          100,
          1000
        ],
        ignoreArrayIndexes: true,
        detectObjects: true
      }
    ],
    'no-mixed-operators': [
      'error', {
        groups: [
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["in", "instanceof"]
        ],
        allowSamePrecedence: true
      }
    ],
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-assign': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-require': 'error',
    'no-new-wrappers': 'error',
    'no-obj-calls': 'error',
    'no-octal': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-plusplus': 'error',
    'no-redeclare': 'error',
    'no-regex-spaces': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-self-assign': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow-restricted-names': 'error',
    'no-sparse-arrays': 'error',
    'no-this-before-super': 'error',
    'no-throw-literal': 'error',
    'no-undef': 'error',
    'no-unexpected-multiline': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': 'error',
    'no-unreachable': 'warn',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    'no-unused-expressions': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-escape': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'no-warning-comments': [
      'warn', {
        terms: [
          'todo', 'fixme'
        ],
        location: 'start'
      }
    ],
    'object-curly-newline': [
      'error', {
        consistent: true
      }
    ],
    'object-curly-spacing': [
      'error',
      'always', {
        objectsInObjects: false
      }
    ],
    'object-shorthand': [
      'error',
      'always', {
        avoidQuotes: true,
        ignoreConstructors: true
      }
    ],
    'one-var': ['error', 'never'],
    'one-var-declaration-per-line': 'error',
    'operator-assignment': 'warn',
    'operator-linebreak': ['error', 'before'],
    'padding-line-between-statements': [
      'warn', {
        blankLine: 'always',
        prev: '*',
        next: 'block-like'
      }, {
        blankLine: 'never',
        prev: ['break', 'continue'],
        next: '*'        
      }, {
        blankLine: 'always',
        prev: '*',
        next: 'class'
      }, {
        blankLine: 'always',
        prev: 'class',
        next: '*'
      }, {
        blankLine: 'always',
        prev: '*',
        next: ['if', 'while', 'do', 'try']
      }, {
        blankLine: 'any',
        prev: ['if', 'while', 'do', 'try', 'empty'],
        next: ['if', 'while', 'do', 'try']
      }
    ],
    'prefer-arrow-callback': 'warn',
    'prefer-const': 'warn',
    'prefer-destructuring': 'warn',
    'prefer-promise-reject-errors': 'error',
    'prefer-reflect': 'warn',
    'prefer-rest-params': 'error',
    'prefer-spread': 'warn',
    'prefer-template': 'error',
    'quote-props': ['error', 'as-needed'],
    quotes: [
      'error',
      'single', {
        avoidEscape: true
      }
    ],
    radix: 'error',
    'require-await': 'error',
    'require-jsdoc': [
      'error', {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: false,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false
        }
      }
    ],
    'require-yield': 'error',
    'rest-spread-spacing': ['error', 'never'],
    'semi': ['error', 'always'],
    'semi-spacing': 'error',
    'semi-style': ['error', 'last'],
    'sort-imports': 'off',
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': [
      'error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': [
      'error', {
        int32Hint: false
      }
    ],
    'space-unary-ops': [
      'error', {
        words: true,
        nonwords: true,
        overrides: {
          '!': false,
          '-': false
        }
      }
    ],
    'spaced-comment': ['error', 'always'],
    'switch-colon-spacing': 'error',
    'template-curly-spacing': 'error',
    'template-tag-spacing': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'error',
    'wrap-iife': 'error'
  }
}

module.exports = eslintConfig;
`;

export default origin;
