import { AddSpacePipe } from './add-space.pipe';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('AddSpacePipe', () => {
  let i18nService: any;

  class MockI18nService {
    detectLanguage(): string {
      return 'fr-CH';
    }
  }

  beforeEach(() => {
    i18nService = new MockI18nService();
  });

  it('create an instance', () => {
    const pipe = new AddSpacePipe(i18nService);
    expect(pipe).toBeTruthy();
  });

  it('return space before colon for french', () => {
    const pipe = new AddSpacePipe(i18nService).transform('Test:', ':');
    expect(pipe).toBe('Test :');
  });

  it('return space before question mark for french', () => {
    const pipe = new AddSpacePipe(i18nService).transform('Test?', '?');
    expect(pipe).toBe('Test ?');
  });

  it('return space before colon and question mark for french', () => {
    const pipe = new AddSpacePipe(i18nService).transform('Test: Test?', ':?');
    expect(pipe).toBe('Test : Test ?');
  });
});
