import { PrismaClient } from '@prisma/client';
import { Transaction } from '@prisma/client';

async function getTransactionsByValue(prisma: PrismaClient, page: string, size: string) {
    try {
        const transactions: Transaction[] = await prisma.transaction.findMany({
            skip: parseInt(page),
            take: parseInt(size),            
            orderBy: [
                {
                    value: 'desc',
                },
            ],
        });

        await prisma.$disconnect();

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

        await prisma.$disconnect();

        return {
            error: true,
            message: `error in getTransactionsByValue ${error}`,
        };
    }
}

export default getTransactionsByValue;
