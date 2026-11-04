class RegistrationError extends Error {
  constructor(errorMessage) {
    super("Registration failed");
    this.name = "RegistrationError";
    this.errorMessage = errorMessage;
  }
}

export default RegistrationError;
