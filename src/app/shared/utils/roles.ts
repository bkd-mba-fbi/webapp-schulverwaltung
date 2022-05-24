export function hasRole(rolesString: Maybe<string>, role: string): boolean {
  const roles = rolesString?.split(';') || [];
  return roles.includes(role);
}
