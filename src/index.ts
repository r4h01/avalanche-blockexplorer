import express from 'express';
import { PrismaClient } from '@prisma/client';
import getTransactionsByAddress from './implementations/transaction_by_address';
import getTransactionsByValue from './implementations/transaction_by_value';
import getWales from './implementations/get_wales';
import getTransactionsByAddressOrdered from './implementations/transaction_by_address_ordered';
const app = express();
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error']});

app.get('/', async (req, res) => {
    res.json({ message: 'Here We Are' });
});

app.get('/transaction-ordered/:address', async (req, res) => {
    const { address } = req.params;
    const transactionByAddress = await getTransactionsByAddressOrdered(address, prisma);
    if (transactionByAddress.error) {
        res.status(500).json({
            error: true,
            message: transactionByAddress.message,
        });
    }

    res.json({
        error: false,
        data: transactionByAddress.data,
    });
});

app.get('/transaction/:address', async (req, res) => {
    const { address } = req.params;
    const transactionByAddress = await getTransactionsByAddress(address, prisma);
    if (transactionByAddress.error) {
        res.status(500).json({
            error: true,
            message: transactionByAddress.message,
        });
    }

    res.json({
        error: false,
        data: transactionByAddress.data,
    });
});

app.get('/transaction-by-value', async (req, res) => {
    const page = req.query.page
    const size = req.query.size
    const transactionsByValue = await getTransactionsByValue(prisma,page, size);
    if (transactionsByValue.error) {
        res.status(500).json({
            error: true,
            message: transactionsByValue.message,
        });
    }

    res.json({
        error: false,
        data: transactionsByValue.data,
    });
});

app.get('/wales', async (req, res) => {
    const wales = await getWales(prisma);
    if (wales.error) {
        res.status(500).json({
            error: true,
            message: wales.message,
        });
    }

    res.json({
        error: false,
        data: wales.data,
    });
});

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
