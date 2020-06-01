import { MessageMetaData } from "../../../../../common/models/metadata-message-attributes.model";

export class NewProductModelMessageAttr {
  // |_ ProductModels
  ProductModelId: MessageMetaData;
  ProductId: MessageMetaData;
  // |__ description
  ProductModelDescription: MessageMetaData;
  // |__ qty
  ProductModelQtyItems: MessageMetaData;
  // |__ specs
  ProductModelTitleSpecs: MessageMetaData;
  ProductModelValueSpecs: MessageMetaData;
  // |__ current price, object?
  ProductModelCurrentPrice: MessageMetaData;
  // |__ marketing,  images array
  ProductModelMarketing: MessageMetaData;
}
