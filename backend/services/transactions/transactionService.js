import DatabaseConnection from '../../models/DatabaseConnection.js';
import Transaction from '../../models/Transaction.js';

export const TransactionService = {
    createTransaction: async (user_id, ticker_id, amount, buy_price) => {
        const newTransaction = {
            user_id,
            ticker_id,
            amount,
            buy_price
        };

        const connection = await DatabaseConnection.getInstance();
        await connection.query(
            'INSERT INTO transaction (user_id, ticker_id, amount, buy_price) VALUES (?, ?, ?, ?)',
            [newTransaction.user_id, newTransaction.ticker_id, newTransaction.amount, newTransaction.buy_price]
        );

        const [rows] = await connection.query('SELECT LAST_INSERT_ID() as id');
        newTransaction.id = rows[0].id;

        return newTransaction;
    },

    deleteTransaction: async (id) => {
        const connection = await DatabaseConnection.getInstance();
        const [result] = await connection.query('DELETE FROM transaction WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    getTransactionById: async (id) => {
        const connection = await DatabaseConnection.getInstance();
        const [results] = await connection.query('SELECT * FROM transaction WHERE id = ?',[id]);
        if (results.length > 0) {
            const tickerData = results[0];
            return Transaction.fromDatabase(tickerData);
        }
        return null;
    },

    getTransactionsByTickerId: async (ticker_id) => {
        const connection = await DatabaseConnection.getInstance();
        const [results] = await connection.query('SELECT * FROM transaction WHERE ticker_id = ?',
            [ticker_id]);
        if (results.length > 0) {
            const tickersData = results;
            return tickersData.map((tickerData) => Transaction.fromDatabase(tickerData));
        }
        return [];
    },

    getTransactionsByUserId: async (user_id) => {
        const connection = await DatabaseConnection.getInstance();
        const [results] = await connection.query('SELECT * FROM transaction WHERE user_id = ?',
            [user_id]);
        if (results.length > 0) {
            const tickerData = results;
            return tickerData.map((tickerData) => Transaction.fromDatabase(tickerData));
        }
        return null;
    }
};