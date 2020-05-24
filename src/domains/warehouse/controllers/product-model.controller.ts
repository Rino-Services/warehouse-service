import { Path, PathParam, POST, FilesParam } from "typescript-rest";
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
   * @param productId Product Id ->uuid, sample: adf36720-8c4a-11ea-88c5-d12b469dd160
   * @param productModelId Product Model Id -> uuid, sample: adf36720-8c4a-11ea-88c5-d12b469dd160
   * @param productModelPhotos[] array of files to upload
   */
  @POST
  @Path("/marketing/:productModelId")
  public async marketingPhotos(
    @PathParam("productModelId") productModelId: string,
    @FilesParam("productModelPhotos[]") files: Array<Express.Multer.File>
  ) {}
}
