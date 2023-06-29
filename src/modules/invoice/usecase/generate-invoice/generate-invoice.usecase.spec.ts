import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const mockRepository = () => {
  return {
    find: jest.fn(),
    generate: jest.fn(),
  };
};

describe("Generate invoice usecase unit test", () => {
  it("should generate a invoice", async () => {
    const invoiceRepository = mockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

    const input = {
      name: "Cliente 1",
      document: "123456789",
      street: "Rua 1",
      number: "1",
      city: "Cidade 1",
      state: "Estado 1",
      zipCode: "12345678",
      complement: "Complemento 1",
      items: [
        {
          id: "1",
          name: "Produto 1",
          price: 10,
        },
        {
          id: "2",
          name: "Produto 2",
          price: 15,
        },
      ],
    };

    const result = await usecase.execute(input);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.city).toBe(input.city);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.items[1].id).toBe(input.items[1].id);
    expect(result.items[1].name).toBe(input.items[1].name);
    expect(result.items[1].price).toBe(input.items[1].price);
  });
});