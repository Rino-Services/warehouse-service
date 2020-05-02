import { Request } from "express";
import { SupplierModelValidator } from "../helpers/supplier-validator";
import { logger } from "../../../common/logger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
export class SupplierValidatorMiddleware {
  public static validateModel(req: Request): void {
    const validationResult = SupplierModelValidator.validate(req.body);

    if (validationResult.error) {
      logger.error(`SupplierController:addNew ${validationResult.error}`);
      throw new BadRequestError(
        `Those fields are required: ${validationResult.error}`
      );
    }
  }
}
