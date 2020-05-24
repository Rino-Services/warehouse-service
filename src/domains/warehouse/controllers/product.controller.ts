import {
  Path,
  PathParam,
  GET,
  POST,
  PreProcessor,
  PUT,
  //FileParam,
} from "typescript-rest";
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
import { ProductValidatorMiddleware } from "../middlewares/product-validator.middleware";
import { NewResource } from "typescript-rest/dist/server/model/return-types";
import { ProductInstanceService } from "../services/product-instance.service";
import { ProductModelDto } from "../../../models/warehouse/dtos/product-model.dto";
import { ProductModelService } from "../services/product-model.service";

@Tags("Product")
@Path("/warehouse/product")
export class ProductController {
  @Inject productService: ProductService;
  @Inject productInstanceService: ProductInstanceService;
  @Inject productModelService: ProductModelService;

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
   * addNewProductModel
   * @param productId uuid, sample: adf36720-8c4a-11ea-88c5-d12b469dd160
   * @param productModelDto Product model basic description
   */
  @POST
  @Path("/add/newModel/:productId")
  @PreProcessor(ProductValidatorMiddleware.vaidateProductId)
  @PreProcessor(ProductValidatorMiddleware.validateProductModel)
  public async addNewProductModel(
    @PathParam("productId") productId: string,
    productModelDto: ProductModelDto
  ) {
    const result = await this.productModelService.addNew({
      dto: productModelDto,
      productId: productId,
    });

    if (!result) {
      throw new InternalServerError(
        `an error has ocurred trying to save a new model`
      );
    } else {
      return result;
    }
  }

  // test
  /**
   * uploadFile
   */
  /*
  @POST
  @Path("upload")
  public uploadFile(@FileParam("cocoFile") file: Express.Multer.File) {
    logger.debug(`File: ${JSON.stringify(file)}`);
  }*/

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

  /**
   *
   * @param productId uuid, sample: adf36720-8c4a-11ea-88c5-d12b469dd160
   * @param serialNumbers serials numbers put in array, sample ["9000000000100", "9000000000200","9000000000300"]
   */
  @PUT
  @Path("/:productId/validateProductItemInStorage")
  @PreProcessor(ProductValidatorMiddleware.vaidateProductId)
  public async validateProductItemInStorage(
    @PathParam("productId") productId: string,
    serialNumbers: Array<string>
  ) {
    const status: string = "VLDN"; // mean validation product

    const result = await this.productInstanceService.setStatus(
      serialNumbers,
      productId,
      status
    );

    if (result < 0) {
      throw new InternalServerError(
        "An error has occuerred while trying to set a Status to Product Items"
      );
    } else {
      return { message: ` ${result} resource added` };
    }
  }

  /**
   *
   * @param productId uuid, sample: adf36720-8c4a-11ea-88c5-d12b469dd160
   * @param serialNumbers serials numbers put in array, sample ["9000000000100", "9000000000200","9000000000300"]
   */
  @PUT
  @Path("/:productId/sendToStock")
  @PreProcessor(ProductValidatorMiddleware.vaidateProductId)
  public async sendToStock(
    @PathParam("productId") productId: string,
    serialNumbers: Array<string>
  ) {
    const status: string = "STCK"; // mean stock

    const result = await this.productInstanceService.setStatus(
      serialNumbers,
      productId,
      status
    );

    if (result < 0) {
      throw new InternalServerError(
        "An error has occuerred while trying to set a Status to Product Items"
      );
    } else {
      return { message: ` ${result} resource added` };
    }
  }
}
