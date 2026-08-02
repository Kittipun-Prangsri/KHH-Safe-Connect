module.exports = {
  apps: [
    {
      name: 'khh-web',
      cwd: '/opt/KHH-Safe-Connect',
      script: 'pnpm',
      args: '--filter @khh/web start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
