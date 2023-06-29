import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ProductAdmFacade from "./product-adm.facade";
import ProductAdmFacadeFactory from "../factory/facade.factory";

describe('ProductAdmFacade test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    // const productRepository = new ProductRepository();
    // const addProductUseCase = new AddProductUseCase(productRepository);
    // const productFacade = new ProductAdmFacade({
    //   addUseCase: addProductUseCase,
    //   stockUseCase: null,
    // });

    const productFacade = ProductAdmFacadeFactory.create();
    const input = {
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    }

    await productFacade.addProduct(input);
    const product = await ProductModel.findOne({ where: { id: input.id } });

    expect(product).toBeDefined();
    expect(product.id).toEqual(input.id);
    expect(product.name).toEqual(input.name);
    expect(product.description).toEqual(input.description);
    expect(product.purchasePrice).toEqual(input.purchasePrice);
    expect(product.stock).toEqual(input.stock);
  });

  it('should check product stock', async () => {
    const productFacade = ProductAdmFacadeFactory.create();
    const input = {
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    }
    await productFacade.addProduct(input);

    const result = await productFacade.checkStock({ productId: input.id });

    expect(result.productId).toEqual(input.id);
    expect(result.stock).toEqual(input.stock);
  });
});