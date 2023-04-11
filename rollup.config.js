export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'iife',
      name: 'capacitorGoogleAuthentication',
      globals: {
        '@capacitor/core': 'capacitorExports',
        'firebase/app': 'app',
        'firebase/auth': 'auth',
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  external: [
    '@capacitor/core',
    'firebase/app',
    'firebase/auth',
  ],
};
