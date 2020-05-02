import * as Joi from "joi";
import { SupplierDto } from "../../../models/warehouse/dtos/supplier.dto";

export class SupplierModelValidator {
  private static readonly Schema: Joi.ObjectSchema = Joi.object().keys({
    id: Joi.string().empty(),
    title: Joi.string().required().max(50),
    description: Joi.string().required().max(100),
  });

  public static validate(supplier: SupplierDto): Joi.ValidationResult<any> {
    return Joi.validate(supplier, this.Schema);
  }
}
