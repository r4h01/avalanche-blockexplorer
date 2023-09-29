import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema
        .dropTableIfExists('transactions')
        .createTable('transactions', (table) => {
            table.string('hash').primary();
            table.string('blockHash');
            table.string('blockNumber');
            table.string('from');
            table.string('gas');
            table.string('gasPrice');
            table.string('maxFeePerGas').nullable();
            table.string('maxPriorityFeePerGas').notNullable();
            table.specificType('input', 'VARCHAR');
            table.string('nonce');
            table.string('r');
            table.string('s');
            table.string('to');
            table.string('transactionIndex');
            table.string('type');
            table.string('v');
            table.specificType('value', 'VARCHAR');
        });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions');
}
