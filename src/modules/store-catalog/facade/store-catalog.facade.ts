import FindAllProductsUsecase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface, { FindAllStoreCatalogFacadeOutputDto, FindStoreCatalogFacadeInputDto, FindStoreCatalogFacadeOutputDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
  findUseCase: FindProductUseCase;
  findAllUseCase: FindAllProductsUsecase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findUseCase: FindProductUseCase;
  private _findAllUseCase: FindAllProductsUsecase;

  constructor({ findUseCase, findAllUseCase }: UseCaseProps) {
    this._findUseCase = findUseCase;
    this._findAllUseCase = findAllUseCase;
  }

  async find(id: FindStoreCatalogFacadeInputDto): Promise<FindStoreCatalogFacadeOutputDto> {
    return this._findUseCase.execute(id);
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return this._findAllUseCase.execute();
  }

}