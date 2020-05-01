import { v1 as uuidv1 } from "uuid";

export class UuIdGenerator {
  public static generate(): string {
    return uuidv1();
  }
}
