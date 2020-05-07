import { Path, PathParam, GET, POST, PreProcessor } from "typescript-rest";
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
import { ProductItemDto } from "../../../models/warehouse/dtos/product-item.dto";
import { ProductValidatorMiddleware } from "../middlewares/product-validator.middleware copy";
import { NewResource } from "typescript-rest/dist/server/model/return-types";
import { ProductInstanceService } from "../services/product-instance.service";

@Tags("Product")
@Path("/warehouse/product")
export class ProductController {
  @Inject productService: ProductService;
  @Inject productInstanceService: ProductInstanceService;

  @GET
  @Path("/all")
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
  @PreProcessor(ProductValidatorMiddleware.validateModel)
  public async addNewProduct(productToAdd: ProductDto): Promise<any> {
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

  /**
   *
   * @param productId uuid, sample: adf36720-8c4a-11ea-88c5-d12b469dd160
   * @param itemsToAdd model thats contains items to add
   */
  @POST
  @Path("/:productId/addProductItems")
  @PreProcessor(ProductValidatorMiddleware.vaidateProductId)
  @PreProcessor(ProductValidatorMiddleware.validateProductItems)
  public async addProductItems(
    @PathParam("productId") productId: string,
    itemsToAdd: ProductItemDto
  ) {
    const result = await this.productService.addNewProductsItems(
      productId,
      itemsToAdd
    );
    if (result) {
      return new NewResource<void>("");
    } else {
      throw new InternalServerError(
        `An error has occuerd while trying to store the information, try agian`
      );
    }
  }

  /**
   *
   * @param productId uuid, sample: adf36720-8c4a-11ea-88c5-d12b469dd160
   */
  @GET
  @Path("/:productId/statusByProduct")
  @PreProcessor(ProductValidatorMiddleware.vaidateProductId)
  public async getProductInstanceStatusByProductId(
    @PathParam("productId") productId: string
  ) {
    const result = await this.productInstanceService.getStatusByProduct(
      productId
    );

    return result;
  }
}
