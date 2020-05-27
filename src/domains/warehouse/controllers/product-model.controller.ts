import { Path, PathParam, POST, FileParam } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import { Inject } from "typescript-ioc";
import { ProductModelService } from "../services/product-model.service";
import { ProductModelRequestValidatorMiddleware } from "../middlewares/product-model-validator.middleware";
import { SpecProduct } from "../../../models/warehouse/dtos/spec-product.dto";
import { SpecService } from "../services/spec.service";
import { NewResource } from "typescript-rest/dist/server/model/return-types";
import { InternalServerError } from "typescript-rest/dist/server/model/errors";

@Tags("Product-Model")
@Path("warehouse/product-model")
export class ProductModelController {
  @Inject productModelService: ProductModelService;
  @Inject specService: SpecService;
  @Inject
  private productModelRequestValidatorMiddleware: ProductModelRequestValidatorMiddleware;

  /**
   *
   * @param productModelId uuid Id, sample: adf36720-8c4a-11ea-88c5-d12b469dd160
   * @param facebookPubImage Facebook image publish
   * @param instagramPubImage Instagram image publish
   * @param Three60FrontPubImage 360 Front image
   * @param Three60LeftPubImage 360 Left image
   * @param Three60RightPubImage 360 Right image
   * @param Three60TopPubImage 360 Top image
   * @param Three60BackPubImage 360 back image
   */
  @POST
  @Path("/marketing/:productModelId")
  public async marketing(
    @PathParam("productModelId") productModelId: string,
    @FileParam("facebookPubImage") facebookPubImage: Express.Multer.File,
    @FileParam("instagramPubImage") instagramPubImage: Express.Multer.File,
    @FileParam("Three60FrontPubImage")
    Three60FrontPubImage: Express.Multer.File,
    @FileParam("Three60LeftPubImage") Three60LeftPubImage: Express.Multer.File,
    @FileParam("Three60RightPubImage")
    Three60RightPubImage: Express.Multer.File,
    @FileParam("Three60TopPubImage") Three60TopPubImage: Express.Multer.File,
    @FileParam("Three60BackPubImage") Three60BackPubImage: Express.Multer.File
  ) {}

  /**
   *
   * @param productModelId uuid, sample: adf36720-8c4a-11ea-88c5-d12b469dd160
   * @param specs array of value pair: [{title: "Color", value: "black"}, {title: "Texture", value: "soft"}]
   */
  @POST
  @Path("/add-specs/:productModelId")
  public async addSpecs(
    @PathParam("productModelId") productModelId: string,
    specs: Array<SpecProduct>
  ) {
    // like a preprocesor
    this.productModelRequestValidatorMiddleware.validateProductModelId(
      productModelId
    );

    this.productModelRequestValidatorMiddleware.validateSpecs(specs);

    this.specService.addSpecs(productModelId, specs);
    return true;
  }

  /**
   *
   * @param productId uuid, sample: adf36720-8c4a-11ea-88c5-d12b469dd160
   * @param itemsToAdd model thats contains items to add
   */
  @POST
  @Path("/:productModelId/addProductItems")
  public async addProductItems(
    @PathParam("productModelId") productModelId: string,
    itemsToAdd: Array<string>
  ) {
    // like a preprocesor
    this.productModelRequestValidatorMiddleware.validateProductModelId(
      productModelId
    );

    this.productModelRequestValidatorMiddleware.validateItems(itemsToAdd);

    const result = await this.productModelService.addNewProductsItems(
      productModelId,
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
}
