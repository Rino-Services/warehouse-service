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
    @FileParam("Three60BackPubImage") Three60BackPubImage: Express.Multer.File,
  ) {}
}
