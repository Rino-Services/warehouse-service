import * as Joi from "joi";
import { ProductDto } from "../../../models/inventory/product.dto";

export class ProductModelValidator {
  private static readonly schema: Joi.ObjectSchema = Joi.object().keys({
    id: Joi.string().empty(),
    title: Joi.string().max(100).required(),
    model: Joi.string().max(100).required(),
  });

  /**
   * validate
   */
  public static validate(product: ProductDto): Joi.ValidationResult<any> {
    return Joi.validate(product, this.schema);
  }
}
