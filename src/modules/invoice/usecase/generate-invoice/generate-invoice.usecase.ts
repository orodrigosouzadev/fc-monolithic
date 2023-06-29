import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address.value-object";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      document: input.document,
      address: new Address({
        street: input.street,
        number: input.number,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
        complement: input.complement,
      }),
      items: input.items.map((item) => {
        return new Product({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        });
      }),
    };

    const invoice = new Invoice(props);
    await this.invoiceRepository.generate(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      complement: invoice.address.complement,
      items: invoice.items.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
        };
      }),
      total: invoice.total,
    };
  }
}