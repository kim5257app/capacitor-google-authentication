export default {
  input: 'dist/esm/firebase.js',
  output: [
    {
      file: 'dist/plugin.js',
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
      file: 'dist/plugin.cjs.js',
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
