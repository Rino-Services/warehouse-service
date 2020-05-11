import { MessageMetaData } from "../../../../../common/models/metadata-message-attributes.model";

export class NewProductMessageAttrs {
  ProductId: MessageMetaData;
  ProductTitle: MessageMetaData;
  ProductModel: MessageMetaData;
  ProductDescription: MessageMetaData;
  ProductDatePublished: MessageMetaData;
  ProductStock: MessageMetaData;
}
