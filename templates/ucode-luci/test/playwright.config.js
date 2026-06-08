const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: process.env.BASE_URL || 'http://openwrt',
    screenshot: 'only-on-failure',
    timeout: 30000,
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    },
  ],
});
