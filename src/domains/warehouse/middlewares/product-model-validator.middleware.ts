import * as Joi from "joi";
import { ProductModelRequestValidatorHelper } from "../helpers/product-model-validator.helper";
import { Inject } from "typescript-ioc";
import { ValidationHandler } from "./base-validator.handler";
import { SpecProduct } from "../../../models/warehouse/dtos/spec-product.dto";

export class ProductModelRequestValidatorMiddleware {
  @Inject private validationHandler: ValidationHandler;
  private readonly controllerName: string = "ProductModelController";
  constructor() {
    this.validationHandler = new ValidationHandler(this.controllerName);
  }
  public validateSpecs(specs: Array<SpecProduct>): void {
    const functionName: string = "validateSpecs";
    const validationResult: Joi.ValidationResult<any> = ProductModelRequestValidatorHelper.validateSpecs(
      specs
    );

    this.validationHandler.badRequestResponse(functionName, validationResult);
  }

  public validateItems(itemsToAdd: Array<string>): void {
    const functionName: string = "validateItems";
    const validationResult: Joi.ValidationResult<any> = ProductModelRequestValidatorHelper.validateItems(
      itemsToAdd
    );

    this.validationHandler.badRequestResponse(functionName, validationResult);
  }

  public validateProductModelId(productModelId: string): void {
    const functionName: string = "validateProductModelId";
    const validationResult: Joi.ValidationResult<any> = ProductModelRequestValidatorHelper.validateProductModelId(
      productModelId
    );

    this.validationHandler.badRequestResponse(functionName, validationResult);
  }
}
