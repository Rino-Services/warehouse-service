import * as Joi from "joi";
import { BrandDto } from "../../../models/warehouse/dtos/brand.dto";

export class BrandModelValidator {
  private static readonly Schema: Joi.ObjectSchema = Joi.object().keys({
    id: Joi.string().empty(),
    title: Joi.string().required().max(50),
    description: Joi.string().required().max(100),
  });

  public static validate(brand: BrandDto): Joi.ValidationResult<any> {
    return Joi.validate(brand, this.Schema);
  }
}
