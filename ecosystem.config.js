module.exports = {
  apps: [
    {
      name: 'khh-web',
      script: 'pnpm',
      args: 'start',
      cwd: '/opt/KHH-Safe-Connect/apps/web',
      env: {
        NODE_ENV: 'production',
        PORT: 5188,
        SESSION_SECRET: 'FHOnR6DquYZDo3Dvwi5bHkCHnBP1qevYCgK4+nemLZ0=',
      },
    },
    {
      name: 'khh-api',
      script: 'pnpm',
      args: 'start',
      cwd: '/opt/KHH-Safe-Connect/apps/api',
      env: {
        NODE_ENV: 'production',
        PORT: 5003,
        SESSION_SECRET: 'FHOnR6DquYZDo3Dvwi5bHkCHnBP1qevYCgK4+nemLZ0=',
      },
    },
  ],
};

