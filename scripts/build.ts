import fs from 'fs';
import process from 'process';
import { Cell } from 'ton-core';
import { compileFunc } from '@ton-community/func-js';

async function main() {
  process.stdout.write('Compiling...');
  const compileResult = await compileFunc({
    targets: ['./contracts/main.fc'],
    sources: (x) => fs.readFileSync(x, 'utf-8'),
  });

  if (compileResult.status === 'error') {
    console.log('[ERROR]');
    console.log(compileResult);
    throw new Error('Compilation error');
  }

  console.log('[OK]');
  if (process.argv.includes('--dump-fift')) {
    console.log(compileResult.fiftCode);
  }
  if (!fs.existsSync('./build')) {
    fs.mkdirSync('./build');
  }

  const hexArtifact = './build/main.json';

  fs.writeFileSync(
    hexArtifact,
    JSON.stringify({
      hex: Cell.fromBoc(Buffer.from(compileResult.codeBoc, 'base64'))[0]
        .toBoc()
        .toString('hex'),
    })
  );
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
