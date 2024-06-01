import {Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode} from "ton-core";

export default class Main implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell, data: Cell }
  ) {}

  static async createFromConfig(config: any, code: Cell, workchain = 0) {
    const data = beginCell().endCell();
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new Main(address, init);
  }

  sendInternalMessage(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    body: Cell
  ) {
    return provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async getLatestSender(provider: ContractProvider) {
    const { stack } = await provider.get('get_the_latest_sender', []);
    return stack.readAddress();
  }

  async getSum(provider: ContractProvider) {
    const { stack } = await provider.get('get_sum', []);
    return stack.readBigNumber();
  }
}