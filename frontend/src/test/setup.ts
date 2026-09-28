import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Without this, each test's render() output stays in the DOM for the
// rest of the file (vitest doesn't run in RTL's "globals" mode here,
// so RTL's automatic afterEach-cleanup never registers on its own) —
// causing spurious "found multiple elements" failures in later tests.
afterEach(() => {
  cleanup();
});
