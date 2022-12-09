import typescript from '@rollup/plugin-typescript';

const config = [
  {
    input: 'build/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'default',
    },
    external: ['axios', 'os', 'url', 'chalk'],
    plugins: [typescript()],
  },
];
export default config;
