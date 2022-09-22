module.exports = {
  locales: ['en', 'ja'],
  lexers: {
    ts: ['JavascriptLexer'],
    tsx: ['JsxLexer'],
  },
  input: 'src/**/*.{ts,tsx}',
  output: 'docs/locales/$LOCALE.json',
  sort: true,
  indentation: 2,
  createOldCatalogs: false,
  namespaceSeparator: ':::',
  keySeparator: '::',
  pluralSeparator: '__',
  contextSeparator: '__',
};
