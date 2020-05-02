import { Request } from "express";
import { ProductModelValidator } from "../helpers/product-validator.helper";
import { logger } from "../../../common/logger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
export class ProductValidatorMiddleware {
  public static validateModel(req: Request): void {
    const validationResult = ProductModelValidator.validate(req.body);

    if (validationResult.error) {
      logger.error(`ProductController:addNewProduct ${validationResult.error}`);
      throw new BadRequestError(
        `Those fields are required: ${validationResult.error}`
      );
    }
  }

  public static validateProductItems(req: Request): void {
    const validationResult = ProductModelValidator.validateProuductItem(
      req.body
    );

    if (validationResult.error) {
      logger.error(
        `ProductController:addProductItems ${validationResult.error}`
      );
      throw new BadRequestError(
        `Those fields are required: ${validationResult.error}`
      );
    }
  }
}
