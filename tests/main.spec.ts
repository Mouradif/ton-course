import { beginCell, Cell, toNano } from 'ton-core';
import { hex } from '../build/main.json';
import { Blockchain } from "@ton-community/sandbox";
import Main from "../wrappers/main";

import '@ton-community/test-utils';

describe('main.fc test', function() {

  it('Stores sender', async () => {
    const blockchain = await Blockchain.create();
    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];

    const myContract = blockchain.openContract(
      await Main.createFromConfig({}, codeCell)
    );

    const senderWallet = await blockchain.treasury("sender");

    const body = beginCell().endCell();
    const sentMessageResult = await myContract.sendInternalMessage(
      senderWallet.getSender(),
      toNano("0.05"),
      body,
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: true,
    });

    const lastSender = await myContract.getLatestSender();

    expect(lastSender.toString()).toBe(senderWallet.address.toString());
  });
});