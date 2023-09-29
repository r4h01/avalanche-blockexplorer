import { PrismaClient } from '@prisma/client';
import { Transaction } from '@prisma/client';
import cChain from '../calls/avaClient';

async function getWales(prisma: PrismaClient) {
    try {
        const transactionsTo: Transaction[] = await prisma.transaction.findMany(
            {
                distinct: ['to'],
                where: {
                    value: {
                        not: '0x0',
                    },
                },
                orderBy: [
                    {
                        value: 'desc',
                    },
                ],
                take: 100,
            }
        );

        const transactionsFrom: Transaction[] =
            await prisma.transaction.findMany({
                distinct: ['from'],
                where: {
                    value: {
                        not: '0x0',
                    },
                },
                orderBy: [
                    {
                        value: 'desc',
                    },
                ],
                take: 100,
            });

        await prisma.$disconnect();

        const addressArray: {
            to?: string;
            from?: string;
            value: number;
            balance?: number;
        }[] = [];
        transactionsTo.map((tx) => {
            if (tx.to) {
                addressArray.push({ to: tx.to, value: parseInt(tx.value, 16) });
            }
        });

        transactionsFrom.map((tx) => {
            if (tx.from) {
                addressArray.push({
                    from: tx.from,
                    value: parseInt(tx.value, 16),
                });
            }
        });

        let walesArray = [];
        for (let i = 0; i < addressArray.length; i++) {
            let balance = await cChain.callMethod(
                'eth_getBalance',
                [
                    addressArray[i].to
                        ? addressArray[i].to
                        : addressArray[i].from,
                    'latest',
                ],
                process.env.AVA_BASE_URL
            );
            addressArray[i].balance = parseInt(balance.data.result, 16);
            if (addressArray[i].balance && addressArray[i].balance > 0) {
                walesArray.push(addressArray[i]);
            }
        }

        walesArray.sort((a, b) => {
            return b.balance - a.balance;
        });

        return {
            error: false,
            data: walesArray.slice(0, 100),
        };
    } catch (error) {
        console.error(error);

        return {
            error: true,
            message: `error in getWales ${error}`,
        };
    }
}

export default getWales;
