const Transaction = require("./transaction");
const ChainUtil = require("../chain-util");
const Wallet = require("./index");

describe("Transaction", () => {
  let wallet, transaction, recipient, amount;
  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = "r3c3p13n7";
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it("outputs the `amount` subtracted from the wallet balance", () => {
    expect(
      transaction.outputs.find(output => output.address === wallet.publicKey)
        .amount
    ).toEqual(wallet.balance - amount);
  });

  it("outputs the `amount` added to the recipient", () => {
    expect(
      transaction.outputs.find(output => output.address === recipient).amount
    ).toEqual(amount);
  });

  it("inputs the balance of the wallet", () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it("validates a valid transaction", () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it("invalidates a corrupt transaction", () => {
    transaction.outputs[0].amount = 500000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe("transacting with an amount exceeding the balance", () => {
    beforeEach(() => {
      amount = 50000;
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it("does not create the transaction", () => {
      expect(transaction).toEqual(undefined);
    });
  });

  describe("and updating a transaction", () => {
    let nextAmount, nextrecipient;

    beforeEach(() => {
      nextAmount = 20;
      nextrecipient = "n3x7-4ddr355";
      transaction = transaction.update(wallet, nextrecipient, nextAmount);
    });

    it(`subtracts the next amount from the sender's output`, () => {
      expect(
        transaction.outputs.find(output => output.address === wallet.publicKey)
          .amount
      ).toEqual(wallet.balance - amount - nextAmount);
    });

    it(`outputs an amount for next recipient`, () => {
      expect(
        transaction.outputs.find(output => output.address === nextrecipient)
          .amount
      ).toEqual(nextAmount);
    });
  });
});
