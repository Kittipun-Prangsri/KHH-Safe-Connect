module.exports = {
  apps: [
    {
      name: 'khh-web',
      script: 'pnpm',
      args: '--filter @khh/web start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'khh-api',
      script: 'pnpm',
      args: '--filter @khh/api start',
      env: {
        NODE_ENV: 'production',
        PORT: 5003,
      },
    },
  ],
};
