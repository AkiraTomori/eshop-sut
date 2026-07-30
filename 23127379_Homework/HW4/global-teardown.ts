import * as fs from 'fs';
import * as path from 'path';
import environment from './test-environment.json';

/**
 * Global Teardown — HW04 EShop Automation
 * Cleans up auth state files after all tests complete.
 */
async function globalTeardown() {
  const authDir = path.dirname(
    path.resolve(__dirname, environment.auth.userState),
  );
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
  }
  console.log('✅ Global teardown complete. Auth state files cleaned.');
}

export default globalTeardown;
