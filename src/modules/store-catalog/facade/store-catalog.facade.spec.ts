import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/facade.factory";

describe('StoreCatalogFacade test', () => {
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

  it('should find a product', async () => {
    await ProductModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      salesPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const facade = StoreCatalogFacadeFactory.create();

    const result = await facade.find({ id: '1' });

    expect(result.id).toEqual('1');
    expect(result.name).toEqual('Product 1');
    expect(result.description).toEqual('Product 1 description');
    expect(result.salesPrice).toEqual(100);
  });

  it('should find all products', async () => {
    await ProductModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      salesPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await ProductModel.create({
      id: '2',
      name: 'Product 2',
      description: 'Product 2 description',
      salesPrice: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const facade = StoreCatalogFacadeFactory.create();

    const result = await facade.findAll();

    expect(result.products.length).toEqual(2);
    expect(result.products[0].id).toEqual('1');
    expect(result.products[0].name).toEqual('Product 1');
    expect(result.products[0].description).toEqual('Product 1 description');
    expect(result.products[0].salesPrice).toEqual(100);
    expect(result.products[1].id).toEqual('2');
    expect(result.products[1].name).toEqual('Product 2');
    expect(result.products[1].description).toEqual('Product 2 description');
    expect(result.products[1].salesPrice).toEqual(200);
  });
});