module.exports = {
  apps: [
    {
      name: 'khh-web',
      script: 'pnpm',
      args: 'start',
      cwd: './apps/web',
      env: {
        NODE_ENV: 'production',
        PORT: 5188,
      },
    },
    {
      name: 'khh-api',
      script: 'pnpm',
      args: 'start',
      cwd: './apps/api',
      env: {
        NODE_ENV: 'production',
        PORT: 5003,
      },
    },
  ],
};

