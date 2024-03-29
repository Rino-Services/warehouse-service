import { SpecProduct } from "./spec-product.dto";

export class ProductDto {
  id: string;
  title: string;
  model: string;
  description: string;
  brandId: string;
  supplierId: string;
  specs: Array<SpecProduct>;
}
