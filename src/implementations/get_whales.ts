import db from '../modules/db';
import { Transaction } from '@prisma/client';
import cChain from '../calls/avaClient';

async function getWhales() {
    try {
        const transactionsTo: Transaction[] = await db.transaction.findMany({
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
        });

        const transactionsFrom: Transaction[] = await db.transaction.findMany({
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

        const whalesArray = [];
        for (let i = 0; i < addressArray.length; i++) {
            const balance = await cChain.callMethod(
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
                whalesArray.push(addressArray[i]);
            }
        }

        whalesArray.sort((a, b) => {
            return b.balance - a.balance;
        });

        return {
            error: false,
            data: whalesArray.slice(0, 100),
        };
    } catch (error) {
        console.error(error);

        return {
            error: true,
            message: `error in getWhales ${error}`,
        };
    }
}

export default getWhales;
