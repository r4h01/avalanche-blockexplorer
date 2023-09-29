import { PrismaClient } from '@prisma/client';
import { Transaction } from '@prisma/client';

async function getTransactionsByAddress(address: string, prisma: PrismaClient) {
    try {
        const transactionsFrom: Transaction[] =
            await prisma.transaction.findMany({
                where: {
                    from: address,
                },
            });

        const transactionsTo: Transaction[] = await prisma.transaction.findMany(
            {
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
            }
        );

        await prisma.$disconnect();

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
        await prisma.$disconnect();

        return {
            error: true,
            message: `error in getTransactionsByAddress ${error}`,
        };
    }
}

export default getTransactionsByAddress;
