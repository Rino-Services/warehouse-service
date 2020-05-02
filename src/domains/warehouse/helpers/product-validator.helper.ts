import * as Joi from "joi";
import { ProductDto } from "../../../models/warehouse/dtos/product.dto";

export class ProductModelValidator {
  private static readonly schema: Joi.ObjectSchema = Joi.object().keys({
    id: Joi.string().empty(),
    title: Joi.string().max(100).required(),
    model: Joi.string().max(100).required(),
    description: Joi.string().empty(),
    brandId: Joi.string().required(),
    supplierId: Joi.string().required(),
    specs: Joi.array(),
  });

  /**
   * validate
   */
  public static validate(product: ProductDto): Joi.ValidationResult<any> {
    return Joi.validate(product, this.schema);
  }
}
