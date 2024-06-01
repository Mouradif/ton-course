import { Cell, contractAddress, StateInit } from 'ton-core';
import { getHttpV4Endpoint } from '@orbs-network/ton-access';
import { hex } from '../build/main.json';
import { TonClient4 } from 'ton';

async function main() {
  const codeCell = Cell.fromBoc(Buffer.from(hex, 'hex'))[0];
  const dataCell = new Cell();
  const stateInit: StateInit = {
    code: codeCell,
    data: dataCell,
  }

  const address = contractAddress(0, stateInit);

  const endpoint = await getHttpV4Endpoint({ network: 'testnet' });
  const client = new TonClient4({ endpoint });

  const latestBlock = await client.getLastBlock();
  const { account } = await client.getAccount(latestBlock.last.seqno, address);
  if (account.state.type !== 'active') {
    throw new Error(`Invalid account state ${account.state.type}`);
  }
  const { exitCode, result } = await client.runMethod(
    latestBlock.last.seqno,
    address,
    'get_the_latest_sender'
  );
  console.log({ exitCode, result });
  console.log(result[0].cell.beginParse().loadAddress().toString({ testOnly: true }));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
