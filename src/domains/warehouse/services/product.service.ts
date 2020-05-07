import { Repository } from "sequelize-typescript";
import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Product } from "../../../models/warehouse/product.model";
import { ProductDto } from "../../../models/warehouse/dtos/product.dto";
import { DatabaseConnection } from "../../../database.connection";
import { UuIdGenerator } from "../helpers/uuid-generator.helper";
import { Spec } from "../../../models/warehouse/spec.model";
import { ProductSpecs } from "../../../models/warehouse/product-specs.model";
import { logger } from "../../../common/logger";
import { SpecProduct } from "../../../models/warehouse/dtos/spec-product.dto";
import { ProductItemDto } from "../../../models/warehouse/dtos/product-item.dto";
import { ProductInstance } from "../../../models/warehouse/product-instance.model";
import { Inject } from "typescript-ioc";
import { ProductInstanceService } from "./product-instance.service";

export class ProductService implements ModelServiceAbstract {
  @Inject productInstanceService: ProductInstanceService;

  private productRepository: Repository<Product>;
  private specRepository: Repository<Spec>;
  private productSpecRepository: Repository<ProductSpecs>;
  private productInstanceRespository: Repository<ProductInstance>;
  private db: DatabaseConnection;

  private readonly logScopeMessage: string = "ProductService :: ";

  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.productRepository = sequelize.getRepository(Product);
    this.specRepository = sequelize.getRepository(Spec);
    this.productSpecRepository = sequelize.getRepository(ProductSpecs);
    this.productInstanceRespository = sequelize.getRepository(ProductInstance);
  }

  public async findAll(): Promise<any> {
    const result = await this.productRepository.findAll({
      include: [this.specRepository],
    });
    return result;
  }

  public async addNew(product: ProductDto): Promise<any> {
    const logMessage: string = `${this.logScopeMessage} addNew ->`;
    try {
      let result = await this.productRepository.create({
        id: UuIdGenerator.generate(),
        title: product.title,
        model: product.model,
        description: product.description,
        brandId: product.brandId,
        supplierId: product.supplierId,
      });

      logger.debug(` ${logMessage} ${JSON.stringify(result)}`);

      // add specs
      this.addSpecs(result.id, product.specs);

      return result;
    } catch (err) {
      logger.error(`${logMessage} -> ${err}`);
    }
  }
  private addSpecs(productId: string, specs: SpecProduct[]): void {
    specs.forEach(async (spec) => {
      const findResult: Spec = await await this.specRepository.findOne<Spec>({
        where: { title: spec.title },
      });
      if (findResult) {
        await this.productSpecRepository.create({
          value: spec.value,
          productId,
          specId: findResult.id,
        });
      } else {
        const specResult: Spec = await this.specRepository.create({
          title: spec.title,
        });

        if (specResult) {
          await this.productSpecRepository.create({
            value: spec.value,
            productId,
            specId: specResult.id,
          });
        }
      }
    });
  }

  public async findById<String>(id: String): Promise<any> {
    let result = await this.productRepository.findOne({ where: { id: id } });
    return result;
  }

  public update<String>(id: String, product: ProductDto): Promise<any> {
    throw new Error("Method not implemented.");
  }

  public async addNewProductsItems(
    productId: string,
    itemsToAdd: ProductItemDto
  ): Promise<boolean> {
    const logMessage: string = `${this.logScopeMessage} -> `;

    try {
      const product = await this.productRepository.findOne({
        where: { id: productId },
      });
      if (product) {
        itemsToAdd.serialNumbers.forEach(async (item) => {
          // validate that serial number does not exist
          if (
            !(await this.productInstanceRespository.findOne({
              where: { serialNumber: item },
            }))
          ) {
            const itemSaved: ProductInstance = await this.productInstanceRespository.create(
              {
                serialNumber: item,
                costUnitPrice: itemsToAdd.costUnitPrice,
                saleUnitPrice: itemsToAdd.saleUnitPrice,
                productId,
              }
            );

            if (itemSaved) {
              await this.productInstanceService.setStatus(
                [itemSaved.serialNumber],
                productId,
                "STRG"
              );
            }
          }
        });
      }

      return true;
    } catch (err) {
      logger.error(`${logMessage} ${err}`);
      return false;
    }
  }
}
