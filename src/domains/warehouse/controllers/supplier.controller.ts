import { Path, GET, POST, PreProcessor } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import { Inject } from "typescript-ioc";
import { SupplierService } from "../services/supplier.service";
import { SupplierDto } from "../../../models/warehouse/dtos/supplier.dto";
import { SupplierValidatorMiddleware } from "../middlewares/supplier-validator.middleware";
import { InternalServerError } from "typescript-rest/dist/server/model/errors";

@Tags("Supplier")
@Path("/warehouse/supplier")
export class SupplierController {
  @Inject supplierService: SupplierService;
  /**
   * Get all supplier companies/person
   */
  @GET
  @Path("/getAll")
  public async getAll() {
    return await this.supplierService.findAll();
  }

  @POST
  @Path("/add")
  @PreProcessor(SupplierValidatorMiddleware.validateModel)
  public async addNew(supplierModel: SupplierDto) {
    const result = await this.supplierService.addNew(supplierModel);
    if (result) {
      return result;
    } else {
      throw new InternalServerError(
        `An error has occuerd while trying to store the information, try agian`
      );
    }
  }
}
