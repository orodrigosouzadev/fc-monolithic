import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address.value-object";
import FindInvoiceUseCase from "./find-invoice.usecase";

const address = new Address({
  street: "Rua 1",
  number: "1",
  city: "Cidade 1",
  state: "Estado 1",
  zipCode: "12345678",
  complement: "Complemento 1",
});

const prod1 = new Product({
  name: "Produto 1",
  price: 10,
});

const prod2 = new Product({
  name: "Produto 2",
  price: 15,
});

const items = [prod1, prod2];

const invoice = new Invoice({
  name: "Cliente 1",
  document: "123456789",
  address: address,
  items: items,
});

const mockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    generate: jest.fn(),
  };
};

describe("Find invoice usecase unit test", () => {
  it("should find an invoice", async () => {
    const invoiceRepository = mockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(result.id).toBe(invoice.id.id);
    expect(invoiceRepository.find).toBeCalledTimes(1);
    expect(result.name).toBe("Cliente 1");
    expect(result.document).toBe("123456789");
    expect(result.street).toBe(address.street);
    expect(result.city).toBe(address.city);
    expect(result.state).toBe(address.state);
    expect(result.zipCode).toBe(address.zipCode);
    expect(result.complement).toBe(address.complement);
    expect(result.items[0].id).toBe(items[0].id.id);
    expect(result.items[0].name).toBe(items[0].name);
    expect(result.items[0].price).toBe(items[0].price);
    expect(result.items[1].id).toBe(items[1].id.id);
    expect(result.items[1].name).toBe(items[1].name);
    expect(result.items[1].price).toBe(items[1].price);
  });
});