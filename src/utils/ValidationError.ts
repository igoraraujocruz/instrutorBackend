export class ValidationError extends Error {
  public statusCode: number;
  public errors: Record<string, string>;

  constructor(errors: Record<string, string>) {
    super("Validation error");
    this.name = "ValidationError";
    this.statusCode = 400;
    this.errors = errors; // ⚡ aqui guardamos diretamente
  }
}
