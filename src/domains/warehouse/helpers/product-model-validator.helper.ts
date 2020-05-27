import * as Joi from "joi";
import { SpecProduct } from "../../../models/warehouse/dtos/spec-product.dto";
export class ProductModelRequestValidatorHelper {
  private static readonly specsSchema: Joi.ArraySchema = Joi.array().required();
  private static readonly productModelIdSchema: Joi.StringSchema = Joi.string()
    .required()
    .uuid();
  private static readonly itemsSchema: Joi.ArraySchema = Joi.array().required();

  public static validateProductModelId(
    productModelId: string
  ): Joi.ValidationResult<any> {
    return Joi.validate(productModelId, this.productModelIdSchema);
  }

  public static validateSpecs(
    specs: Array<SpecProduct>
  ): Joi.ValidationResult<any> {
    return Joi.validate(specs, this.specsSchema);
  }

  public static validateItems(
    itemsToAdd: Array<string>
  ): Joi.ValidationResult<any> {
    return Joi.validate(itemsToAdd, this.itemsSchema);
  }
}
