import * as fs from 'node:fs';
import * as path from 'node:path';
import environment from './test-environment.json';

function removeAuthState(relativeStatePath: string): void {
  const statePath = path.resolve(__dirname, relativeStatePath);
  if (fs.existsSync(statePath)) {
    fs.rmSync(statePath);
  }
}

async function globalTeardown(): Promise<void> {
  removeAuthState(environment.auth.userState);
  removeAuthState(environment.auth.adminState);

  const authDirectory = path.dirname(
    path.resolve(__dirname, environment.auth.userState),
  );
  if (fs.existsSync(authDirectory) && fs.readdirSync(authDirectory).length === 0) {
    fs.rmdirSync(authDirectory);
  }
}

export default globalTeardown;
