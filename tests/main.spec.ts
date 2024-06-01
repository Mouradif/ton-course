import { beginCell, Cell, toNano } from 'ton-core';
import { hex } from '../build/main.json';
import { Blockchain } from "@ton-community/sandbox";
import Main from "../wrappers/main";

import '@ton-community/test-utils';

describe('main.fc test', function() {

  it('Stores sender', async () => {
    const blockchain = await Blockchain.create();
    const codeCell = Cell.fromBoc(Buffer.from(hex, 'hex'))[0];
    const sender = await blockchain.treasury("sender");

    const body = beginCell().storeUint(0n, 32).endCell();
    const main = blockchain.openContract(
      await Main.createFromConfig({}, codeCell),
    );
    const message = await main.sendInternalMessage(
      sender.getSender(),
      toNano('0.01'),
      body,
    );
    expect(message.transactions).toHaveTransaction({
      from: sender.address,
      to: main.address,
      success: true,
    });
    const latestSender = await main.getLatestSender();
    expect(latestSender.toString()).toBe(sender.address.toString());
  });

  it('Accumulates value', async () => {
    const blockchain = await Blockchain.create();
    const codeCell = Cell.fromBoc(Buffer.from(hex, 'hex'))[0];
    const sender = await blockchain.treasury("sender");

    const main = blockchain.openContract(
      await Main.createFromConfig({}, codeCell),
    );

    const body = beginCell().storeUint(45n, 32).endCell();
    const message1 = await main.sendInternalMessage(
      sender.getSender(),
      toNano('0.01'),
      body
    );
    expect(message1.transactions).toHaveTransaction({
      from: sender.address,
      to: main.address,
      success: true,
    });
    const message2 = await main.sendInternalMessage(
      sender.getSender(),
      toNano('0.01'),
      body
    );
    expect(message2.transactions).toHaveTransaction({
      from: sender.address,
      to: main.address,
      success: true,
    });
    const latestSender = await main.getSum();
    expect(latestSender).toEqual(90n);
  });
});