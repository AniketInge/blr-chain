const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./index");

describe("TransactionPool", () => {
  let tp, wallet, transaction;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, "r4nd-4ddr355", 30);
    tp.updateOrAddTransaction(transaction);
  });

  it("adds a transaction to the pool", () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(
      transaction
    );
  });

  it("updates a transaction in the pool", () => {
    const oldTransaction = JSON.stringify(transaction);
    transaction = transaction.update(wallet, "f00-4ddr355", 40);
    tp.updateOrAddTransaction(transaction);

    expect(
      JSON.stringify(tp.transactions.find(t => t.id === transaction.id))
    ).not.toEqual(oldTransaction);
  });
});
