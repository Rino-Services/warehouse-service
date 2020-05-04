import { Path, GET } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import { Inject } from "typescript-ioc";
import { WarehouseStatusService } from "../services/warehouse-status.service";

@Tags("Warehouse-Status")
@Path("/warehouse/status")
export class WarehouseStatusController {
  @Inject warehouseStatusService: WarehouseStatusService;

  @GET
  @Path("/getAll")
  public async getAll() {
    return this.warehouseStatusService.findAll();
  }
}
