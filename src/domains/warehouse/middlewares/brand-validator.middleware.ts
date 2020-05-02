import { Request } from "express";
import { BrandModelValidator } from "../helpers/brand-validator";
import { logger } from "../../../common/logger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
export class BrandValidatorMiddleware {
  public static validateModel(req: Request): void {
    const validationResult = BrandModelValidator.validate(req.body);

    if (validationResult.error) {
      logger.error(`BrandController:addNew ${validationResult.error}`);
      throw new BadRequestError(
        `Those fields are required: ${validationResult.error}`
      );
    }
  }
}
