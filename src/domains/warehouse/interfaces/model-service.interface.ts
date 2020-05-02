export interface ModelServiceAbstract {
  addNew(modelDto: any): Promise<any>;
  findById<T>(id: T): Promise<any>; // T should be Number | String
  findAll(): Promise<any>;
  update<T>(id: T, model: any): Promise<any>; // T should be Number | String
}
