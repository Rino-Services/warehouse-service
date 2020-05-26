import { Path, PathParam, POST, FileParam } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import { Inject } from "typescript-ioc";
import { ProductModelService } from "../services/product-model.service";

@Tags("Product-Model")
@Path("warehouse/:productId/product-model")
export class ProductModelController {
  @PathParam("productId")
  productId: string;

  @Inject productModelService: ProductModelService;

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
}
