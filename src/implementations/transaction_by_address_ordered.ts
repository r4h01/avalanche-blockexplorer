import db from '../modules/db';
import { Transaction } from '@prisma/client';

async function getTransactionsByAddressOrdered(address: string) {
    try {
        const transactionsFrom: Transaction[] = await db.transaction.findMany({
            where: {
                from: address,
            },
            orderBy: [
                {
                    blockNumber: 'desc',
                },
                {
                    transactionIndex: 'desc',
                },
            ],
        });

        const transactionsTo: Transaction[] = await db.transaction.findMany({
            where: {
                to: address,
            },
            orderBy: [
                {
                    blockNumber: 'desc',
                },
                {
                    transactionIndex: 'desc',
                },
            ],
        });

        if (transactionsFrom.length > 0 || transactionsTo.length > 0) {
            return {
                error: false,
                data: {
                    tx_made: transactionsFrom,
                    tx_received: transactionsTo,
                },
            };
        } else {
            return {
                error: false,
                data: 'No transactions found',
            };
        }
    } catch (error) {
        console.error(error);

        return {
            error: true,
            message: `error in getTransactionsByAddressOrdered ${error}`,
        };
    }
}

export default getTransactionsByAddressOrdered;
