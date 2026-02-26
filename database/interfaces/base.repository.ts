export interface IBaseRepository {
  delete(id: string): Promise<void>;
}
