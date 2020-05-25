import * as Joi from "joi";
import { ProductDto } from "../../../models/warehouse/dtos/product.dto";
import { ProductItemDto } from "../../../models/warehouse/dtos/product-item.dto";
import { ProductModelDto } from "../../../models/warehouse/dtos/product-model.dto";

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

  private static readonly productModelSchema: Joi.ObjectSchema = Joi.object().keys(
    {
      costPrice: Joi.number().greater(0).required(),
      description: Joi.string().required(),
      unitPrice: Joi.number().greater(0).required(),
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

  public static validateProductModel(
    productModel: ProductModelDto
  ): Joi.ValidationResult<any> {
    return Joi.validate(productModel, this.productModelSchema);
  }
}
