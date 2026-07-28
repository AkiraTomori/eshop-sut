import * as fs from 'fs';
import * as path from 'path';

/**
 * Global Teardown — HW04 EShop Automation
 * Cleans up auth state files after all tests complete.
 */
async function globalTeardown() {
  const authDir = path.join(__dirname, '.auth');
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
  }
  console.log('✅ Global teardown complete. Auth state files cleaned.');
}

export default globalTeardown;
