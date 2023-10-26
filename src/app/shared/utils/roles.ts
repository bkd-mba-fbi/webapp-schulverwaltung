export function hasRole(rolesString: Maybe<string>, role: string): boolean {
  return getRoles(rolesString).includes(role);
}

export function getRoles(rolesString: Maybe<string>): ReadonlyArray<string> {
  if (!rolesString) {
    return [];
  }
  return rolesString.split(";");
}
