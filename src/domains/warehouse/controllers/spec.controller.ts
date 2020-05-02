import { Path, GET } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import { Inject } from "typescript-ioc";
import { SpecService } from "../services/spec.service";

@Tags("Spec")
@Path("/warehouse/spec")
export class SpecController {
  @Inject specService: SpecService;

  @GET
  @Path("/getAll")
  public async getAll() {
    return await this.specService.findAll();
  }
}
