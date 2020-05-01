import { Path, PathParam, GET, POST } from "typescript-rest";
import { Inject } from "typescript-ioc";
import { ProductService } from "../services/product.service";
import { ProductDto } from "../../../models/warehouse/dtos/product.dto";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "typescript-rest/dist/server/model/errors";
import { Tags } from "typescript-rest-swagger";
import { logger } from "../../../common/logger";
import { ProductModelValidator } from "../helpers/product-validator.helper";

@Path("/inventory/product")
export class ProductController {
  @Inject productService: ProductService;

  @GET
  @Path("/all")
  @Tags("Inventory", "Products")
  public async getAll() {
    const result = await this.productService.findAll();
    return result;
  }

  /**
   *
   * @param id
   */
  @GET
  @Path("/find/:id")
  @Tags("Inventory", "Products")
  public async findProductById(@PathParam("id") id: string) {
    if (id == null) {
      throw new BadRequestError("Id required");
    }

    try {
      const result: ProductDto = await this.productService.findById(id);
      if (!result) {
        throw new NotFoundError(`Product with id: ${id} not found`);
      }

      logger.debug(result);

      return result;
    } catch (err) {
      logger.error(`On ProductController:findProductById ${err}`);
      throw new InternalServerError(`${err}`);
    }
  }

  /**
   *
   * @param productToAdd
   */
  @POST
  @Path("/add")
  @Tags("Inventory", "Products")
  public async addNewProduct(productToAdd: ProductDto): Promise<any> {
    const validationResult = ProductModelValidator.validate(productToAdd);

    if (validationResult.error) {
      logger.error(`ProductController:addNewProduct ${validationResult.error}`);
      throw new BadRequestError(
        `Those fields are required: ${validationResult.error}`
      );
    }

    try {
      const result = await this.productService.addNew(productToAdd);
      logger.debug(result);
      if (!result) {
        const message: string = "Some was wrong when tried to save a record";
        logger.warning(`${message}`);
        throw new BadRequestError(`${message}`);
      }

      return result;
    } catch (err) {
      logger.error(`ProductController:addNewProduct ${err}`);
      throw new InternalServerError(`${err}`);
    }
  }
}
