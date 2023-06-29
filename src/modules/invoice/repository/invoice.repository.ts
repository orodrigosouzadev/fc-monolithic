import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice.entity";
import Product from "../domain/entity/product.entity";
import Address from "../domain/value-object/address.value-object";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(input: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: input.id.id,
      name: input.name,
      document: input.document,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipCode: input.address.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: input.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
    }, {
      include: [{
        model: InvoiceItemModel,
      }],
    });
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: ["items"],
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      }),
      items: invoice.items.map((item) => {
        return new Product({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        });
      }),
      createdAt: invoice.createdAt,
    });
  }
}
