import cChain from '../calls/avaClient';
import { PrismaClient } from '@prisma/client';
import { Transaction } from '@prisma/client';
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function getLatestTransactions() {
    try {
        const latestBlock = await cChain.callMethod(
            'eth_getBlockByNumber',
            ['latest', false],
            process.env.AVA_BASE_URL
        );
        const blockNumb: string = latestBlock.data.result.number;

        let blockNumbInt = parseInt(blockNumb, 16);

        for (let i = 0; i < 10000; i++) {
            blockNumbInt -= i;
            if (blockNumbInt < 0) {
                break;
            }
            const blockNumbHex = blockNumbInt.toString(16);

            const response = await cChain.callMethod(
                'eth_getBlockByNumber',
                [`0x${blockNumbHex}`, true],
                process.env.AVA_BASE_URL
            );

            response.data.result.transactions.map(async (txEl: Transaction) => {
                await prisma.transaction.create({
                    data: {
                        hash: txEl.hash,
                        blockHash: txEl.blockHash,
                        blockNumber: txEl.blockNumber,
                        from: txEl.from,
                        gas: txEl.gas,
                        gasPrice: txEl.gasPrice,
                        maxFeePerGas: txEl.maxFeePerGas
                            ? txEl.maxFeePerGas
                            : ' ',
                        maxPriorityFeePerGas: txEl.maxPriorityFeePerGas
                            ? txEl.maxPriorityFeePerGas
                            : ' ',
                        input: txEl.input,
                        nonce: txEl.nonce,
                        r: txEl.r,
                        s: txEl.s,
                        to: txEl.to ? txEl.to : ' ',
                        transactionIndex: txEl.transactionIndex,
                        type: txEl.type,
                        v: txEl.v,
                        value: txEl.value,
                    },
                });
            });
        }

        return {
            error: false,
            data: 'Transactions added',
        };
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

getLatestTransactions();
