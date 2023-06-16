const mapping: Record<string, string> = {
  components: 'component',
  invitations: 'invitation',
  showcases: 'showcase',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
