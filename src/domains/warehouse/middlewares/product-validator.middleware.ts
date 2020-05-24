import { Request } from "express";
import { ProductModelValidator } from "../helpers/product-validator.helper";
import { logger } from "../../../common/logger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
export class ProductValidatorMiddleware {
  private static readonly logScopeMessage: string = `ProductController :: `;

  public static validateModel(req: Request): void {
    const validationResult = ProductModelValidator.validate(req.body);

    if (validationResult.error) {
      logger.error(
        `${this.logScopeMessage} addNewProduct ${validationResult.error}`
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
        ` ${this.logScopeMessage} addProductItems ${validationResult.error}`
      );
      throw new BadRequestError(
        `Those fields are required: ${validationResult.error}`
      );
    }
  }

  public static vaidateProductId(req: Request) {
    const productId = req.query.productId;
    if (productId != null) {
      const errorMessage: string = "productId can be null";
      logger.warning(
        `${this.logScopeMessage} getProductInstanceStatusByProductId -> ${errorMessage}`
      );
      throw new BadRequestError(`${errorMessage}`);
    }
  }
}
