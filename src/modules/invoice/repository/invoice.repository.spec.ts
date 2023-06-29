import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice.entity";
import Product from "../domain/entity/product.entity";
import Address from "../domain/value-object/address.value-object";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";

const product1 = new Product({
  id: new Id("1"),
  name: "Product 1",
  price: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const product2 = new Product({
  id: new Id("2"),
  name: "Product 2",
  price: 20,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const props = {
  id: new Id("1"),
  name: "Invoice 1",
  document: "1456789",
  createdAt: new Date(),
  updatedAt: new Date(),
  address: new Address({
    street: "Rua 1",
    number: "123",
    complement: "Casa 1",
    zipCode: "12345678",
    city: "São Paulo",
    state: "SP",
  }),
  items: [product1, product2],
};

describe("Invoice Repository unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a new invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    const invoice = new Invoice(props);

    await invoiceRepository.generate(invoice);

    const result = await invoiceRepository.find(invoice.id.id);

    expect(result.id.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.document).toBe("1456789");
    expect(result.address.street).toBe("Rua 1");
    expect(result.address.number).toBe("123");
    expect(result.address.complement).toBe("Casa 1");
    expect(result.address.zipCode).toBe("12345678");
    expect(result.address.city).toBe("São Paulo");
    expect(result.address.state).toBe("SP");
    expect(result.items.length).toBe(2);
    expect(result.items[0].id.id).toBe("1");
    expect(result.items[0].name).toBe("Product 1");
    expect(result.items[0].price).toBe(10);
    expect(result.items[1].id.id).toBe("2");
    expect(result.items[1].name).toBe("Product 2");
    expect(result.items[1].price).toBe(20);
  });

  it("should find a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    const invoice = new Invoice(props);

    await invoiceRepository.generate(invoice);

    const result = await invoiceRepository.find("1");

    expect(result.id.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.document).toBe("1456789");
    expect(result.address.street).toBe("Rua 1");
    expect(result.address.number).toBe("123");
    expect(result.address.complement).toBe("Casa 1");
    expect(result.address.zipCode).toBe("12345678");
    expect(result.address.city).toBe("São Paulo");
    expect(result.address.state).toBe("SP");
    expect(result.items.length).toBe(2);
    expect(result.items[0].id.id).toBe("1");
    expect(result.items[0].name).toBe("Product 1");
    expect(result.items[0].price).toBe(10);
    expect(result.items[1].id.id).toBe("2");
    expect(result.items[1].name).toBe("Product 2");
    expect(result.items[1].price).toBe(20);
  });
});