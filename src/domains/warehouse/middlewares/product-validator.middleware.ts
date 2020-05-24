import { Request } from "express";
import { ProductModelValidator } from "../helpers/product-validator.helper";
import { logger } from "../../../common/logger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
export class ProductValidatorMiddleware {
  public static validateModel(req: Request): void {
    const validationResult = ProductModelValidator.validate(req.body);

    if (validationResult.error) {
      logger.error(
        `ProductController :: addNewProduct ${validationResult.error}`
      );
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
        ` ProductController :: addProductItems ${validationResult.error}`
      );
      throw new BadRequestError(
        `Those fields are required: ${validationResult.error}`
      );
    }
  }

  public static vaidateProductId(req: Request) {
    const productId = req.params.productId;
    if (productId == null) {
      const errorMessage: string = "productId can't be null";
      logger.error(
        ` ProductController ::  getProductInstanceStatusByProductId -> ${errorMessage}`
      );
      throw new BadRequestError(`${errorMessage}`);
    }
  }

  public static validateProductModel(req: Request) {
    const validationResult = ProductModelValidator.validateProductModel(
      req.body
    );

    if (validationResult.error) {
      logger.error(
        `ProductController :: addNewProductModel ${validationResult.error}`
      );
      throw new BadRequestError(
        `Those fields are required: ${validationResult.error}`
      );
    }
  }
}
