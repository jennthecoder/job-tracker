import { HttpStatusCode } from 'axios';
import CustomAPIError from './custom-api.js'

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = HttpStatusCode.BadRequest
  }
}

export default BadRequestError
