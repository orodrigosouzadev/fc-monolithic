import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const transaction = new Transaction({
  id: new Id('1'),
  amount: 100,
  orderId: '1',
  status: 'approved',
});

const transactionDeclined = new Transaction({
  id: new Id('1'),
  amount: 99,
  orderId: '1',
  status: 'declined',
});

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
  };
}

describe('Process Payment usecase unit test', () => {
  it('should approve a transaction', async () => {
    const repository = MockRepository();
    const usecase = new ProcessPaymentUseCase(repository);
    const input = {
      orderId: '1',
      amount: 100,
    }

    const result = await usecase.execute(input);

    expect(result.transactionId).toEqual(transaction.id.id);
    expect(repository.save).toHaveBeenCalled();
    expect(result.status).toEqual('approved');
    expect(result.amount).toEqual(100);
    expect(result.orderId).toEqual('1');
    expect(result.createdAt).toEqual(transaction.createdAt);
    expect(result.updatedAt).toEqual(transaction.updatedAt);
  });

  it('should decline a transaction', async () => {
    const repository = MockRepository();
    repository.save = jest.fn().mockReturnValueOnce(Promise.resolve(transactionDeclined));
    const usecase = new ProcessPaymentUseCase(repository);
    const input = {
      orderId: '1',
      amount: 99,
    }

    const result = await usecase.execute(input);

    expect(result.transactionId).toEqual(transaction.id.id);
    expect(repository.save).toHaveBeenCalled();
    expect(result.status).toEqual('declined');
    expect(result.amount).toEqual(99);
    expect(result.orderId).toEqual('1');
    expect(result.createdAt).toEqual(transaction.createdAt);
    expect(result.updatedAt).toEqual(transaction.updatedAt);
  });
});