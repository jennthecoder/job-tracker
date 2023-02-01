import { HttpStatusCode } from "axios";
import CustomAPIError from './custom-api.js';

class unAuthenticatedError extends CustomAPIError {
  constructor(message){
    super(message)
    this.statusCode = HttpStatusCode.Unauthorized
  }
}

export default unAuthenticatedError;
