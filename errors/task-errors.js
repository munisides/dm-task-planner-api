class CustomTaskError extends Error {
    constructor(message, statusCode) {
      super(message)
      this.statusCode = statusCode;
    }
}

const createTaskError = (msg, statusCode) => {
  return new CustomTaskError(msg, statusCode);
}
  
module.exports = { createTaskError, CustomTaskError }
