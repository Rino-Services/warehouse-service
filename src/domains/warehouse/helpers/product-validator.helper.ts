import * as Joi from "joi";
import { ProductDto } from "../../../models/warehouse/dtos/product.dto";
import { ProductItemDto } from "../../../models/warehouse/dtos/product-item.dto";

export class ProductModelValidator {
  private static readonly mainSchema: Joi.ObjectSchema = Joi.object().keys({
    id: Joi.string().empty(),
    title: Joi.string().max(100).required(),
    baseImageUrl: Joi.string(),
    description: Joi.string().empty(),
    brandId: Joi.string().required(),
    supplierId: Joi.string().required(),
  });

  private static readonly productItemSchema: Joi.ObjectSchema = Joi.object().keys(
    {
      costUnitPrice: Joi.number().greater(0).required(),
      saleUnitPrice: Joi.number().greater(0).required(),
      serialNumbers: Joi.array().required(),
    }
  );
  /**
   * validate
   */
  public static validate(product: ProductDto): Joi.ValidationResult<any> {
    return Joi.validate(product, this.mainSchema);
  }

  public static validateProuductItem(
    product: ProductItemDto
  ): Joi.ValidationResult<any> {
    return Joi.validate(product, this.productItemSchema);
  }
}
