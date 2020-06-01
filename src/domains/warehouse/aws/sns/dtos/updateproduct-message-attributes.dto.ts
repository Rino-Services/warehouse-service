import { MessageMetaData } from "../../../../../common/models/metadata-message-attributes.model";

export class UpdateProductInventoryMessageAttrs {  
  ProductModelId: MessageMetaData;
  Operation: MessageMetaData;
  Qty: MessageMetaData;
}
