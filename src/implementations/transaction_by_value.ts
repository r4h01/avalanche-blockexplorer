import db from '../modules/db';
import { Transaction } from '@prisma/client';

async function getTransactionsByValue(page: string, size: string) {
    try {
        const transactions: Transaction[] = await db.transaction.findMany({
            skip: parseInt(page),
            take: parseInt(size),
            orderBy: [
                {
                    value: 'desc',
                },
            ],
        });

        if (transactions.length > 0) {
            return {
                error: false,
                data: transactions,
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
            message: `error in getTransactionsByValue ${error}`,
        };
    }
}

export default getTransactionsByValue;
