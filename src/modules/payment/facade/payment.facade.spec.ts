import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import PaymentFacadeFactory from "../factory/payment.facade.factory";

describe('PaymentFacade test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a transaction', async () => {
    const facade = PaymentFacadeFactory.create();
    const input = {
      orderId: '1',
      amount: 100,
    }

    const result = await facade.process(input);

    expect(result.transactionId).toBeDefined();
    expect(result.orderId).toEqual(input.orderId);
    expect(result.amount).toEqual(input.amount);
    expect(result.status).toEqual('approved');
  })
});