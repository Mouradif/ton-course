import { beginCell, Cell, contractAddress, StateInit, storeStateInit, toNano } from 'ton-core';
import { hex } from '../build/main.json';

async function main() {
  const codeCell = Cell.fromBoc(Buffer.from(hex, 'hex'))[0];
  const dataCell = new Cell();

  const stateInit: StateInit = {
    code: codeCell,
    data: dataCell,
  }

  const stateInitBuilder = beginCell();
  storeStateInit(stateInit)(stateInitBuilder);
  const stateInitCell = stateInitBuilder.endCell();

  const address = contractAddress(0, stateInit);

  const url = new URL(`https://test.tonhub.com/transfer/${address.toString({ testOnly: true })}`);
  url.searchParams.set('text', 'Deploy contract');
  url.searchParams.set('amount', toNano('0.01').toString());
  url.searchParams.set('init', stateInitCell.toBoc({ idx: false }).toString('base64'));

  console.log(url.toString());
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});