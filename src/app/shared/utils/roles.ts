export function hasRole(rolesString: Maybe<string>, role: string): boolean {
  if (!rolesString) return false;
  return rolesString.split(';').includes(role);
}
