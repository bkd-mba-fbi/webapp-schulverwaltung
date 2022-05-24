import { hasRole } from './roles';

describe('roles', () => {
  it('should return true if it has role', () => {
    // given
    const roles = 'TeacherRole';

    // then
    expect(hasRole(roles, 'TeacherRole')).toBeTrue();
  });

  it('should return true if it has role - multiple roles', () => {
    // given
    const roles = 'ClassTeacherRole;TeacherRole';

    // then
    expect(hasRole(roles, 'TeacherRole')).toBeTrue();
  });

  it('should return false if it does not have role', () => {
    // given
    const roles = 'ClassTeacherRole';

    // then
    expect(hasRole(roles, 'TeacherRole')).toBeFalse();
  });

  it('should return false if it does not have role - multiple roles', () => {
    // given
    const roles = 'ClassTeacherRole;TeacherRole';

    // then
    expect(hasRole(roles, 'StudentRole')).toBeFalse();
  });

  it('should return false if roles are empty', () => {
    // then
    expect(hasRole('', 'StudentRole')).toBeFalse();
  });

  it('should return false if roles are null', () => {
    // then
    expect(hasRole(null, 'StudentRole')).toBeFalse();
  });

  it('should return false if roles are undefined', () => {
    // then
    expect(hasRole(undefined, 'StudentRole')).toBeFalse();
  });
});
