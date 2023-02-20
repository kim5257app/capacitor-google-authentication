export interface GoogleAuthenticationPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
