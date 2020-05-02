import { Path, GET, POST, PreProcessor } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import { BrandDto } from "../../../models/warehouse/dtos/brand.dto";
import { Inject } from "typescript-ioc";
import { BrandService } from "../services/brand.service";
import { BrandValidatorMiddleware } from "../middlewares/brand-validator.middleware";
import { InternalServerError } from "typescript-rest/dist/server/model/errors";

@Tags("Brand")
@Path("/warehouse/brand")
export class BrandController {
  @Inject brandService: BrandService;

  @GET
  @Path("/getAll")
  public async getAll() {
    return this.brandService.findAll();
  }

  @POST
  @Path("/add")
  @PreProcessor(BrandValidatorMiddleware.validateModel)
  public async add(brandModel: BrandDto) {
    const result = await this.brandService.addNew(brandModel);
    if (result) {
      return result;
    } else {
      throw new InternalServerError(
        `An error has occuerd while trying to store the information, try agian`
      );
    }
  }
}
