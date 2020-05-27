import * as Joi from "joi";
import { logger } from "../../../common/logger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";

export class ValidationHandler {
  constructor(private controllerNameScope: string) {}

  public badRequestResponse(
    functionNameScope: string,
    validationResult: Joi.ValidationResult<any>
  ): void {
    if (validationResult.error) {
      logger.error(
        ` ${this.controllerNameScope} :: ${functionNameScope} ${validationResult.error}`
      );
      throw new BadRequestError(
        `Those fields are required: ${validationResult.error}`
      );
    }
  }
}
