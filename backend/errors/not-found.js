import { HttpStatusCode } from 'axios'
import CustomAPIError from './custom-api.js'

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = HttpStatusCode.NotFound
  }
}

export default NotFoundError
