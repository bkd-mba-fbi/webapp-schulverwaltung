import { SafePipe } from './safe.pipe';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('SafePipe', () => {
  let sanitizer: any;

  beforeEach(() => {
    sanitizer = {};
  });

  it('create an instance', () => {
    const pipe = new SafePipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});
