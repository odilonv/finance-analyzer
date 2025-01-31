import { jest } from "@jest/globals";
import { TransactionService } from "../services/transactions/transactionService.js";
import DatabaseConnection from "../models/DatabaseConnection.js";
import Transaction from "../models/Transaction.js";

jest.mock("../models/DatabaseConnection.js");

describe("TransactionService", () => {
    let mockConnection;

    beforeEach(() => {
        mockConnection = {
            query: jest.fn(),
        };
        DatabaseConnection.getInstance.mockResolvedValue(mockConnection);
    });

    test("createTransaction should insert a new transaction and return it", async () => {
        mockConnection.query
            .mockResolvedValueOnce([{ insertId: 1 }])
            .mockResolvedValueOnce([[{ id: 1 }]]);

        const transaction = await TransactionService.createTransaction(1, 2, 100, 50.5);

        expect(mockConnection.query).toHaveBeenCalledWith(
            "INSERT INTO transaction (user_id, ticker_id, amount, buy_price) VALUES (?, ?, ?, ?)",
            [1, 2, 100, 50.5]
        );

        expect(mockConnection.query).toHaveBeenCalledWith("SELECT LAST_INSERT_ID() as id");
        expect(transaction).toEqual({
            id: 1,
            user_id: 1,
            ticker_id: 2,
            amount: 100,
            buy_price: 50.5,
        });
    });

    test("deleteTransaction should remove a transaction and return true if deleted", async () => {
        mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const result = await TransactionService.deleteTransaction(1);

        expect(mockConnection.query).toHaveBeenCalledWith(
            "DELETE FROM transaction WHERE id = ?", [1]
        );

        expect(result).toBe(true);
    });

    test("getTransactionById should return a transaction if found", async () => {
        const mockTransaction = { id: 1, user_id: 1, ticker_id: 2, amount: 100, buy_price: 50.5 };

        mockConnection.query.mockResolvedValueOnce([[mockTransaction]]);
        jest.spyOn(Transaction, "fromDatabase").mockReturnValue(mockTransaction);

        const result = await TransactionService.getTransactionById(1);

        expect(mockConnection.query).toHaveBeenCalledWith(
            "SELECT * FROM transaction WHERE id = ?", [1]
        );
        expect(result).toEqual(mockTransaction);
    });

    test("getTransactionsByUserId should return transactions for a given user", async () => {
        const mockTransactions = [
            { id: 1, user_id: 1, ticker_id: 2, amount: 100, buy_price: 50.5 },
            { id: 2, user_id: 1, ticker_id: 3, amount: 200, buy_price: 75.0 },
        ];

        mockConnection.query.mockResolvedValueOnce([mockTransactions]);
        jest.spyOn(Transaction, "fromDatabase").mockImplementation(data => data);

        const result = await TransactionService.getTransactionsByUserId(1);

        expect(mockConnection.query).toHaveBeenCalledWith(
            "SELECT * FROM transaction WHERE user_id = ?", [1]
        );
        expect(result).toEqual(mockTransactions);
    });

    test("getTransactionsByTickerId should return transactions for a given ticker", async () => {
        const mockTransactions = [
            { id: 1, user_id: 1, ticker_id: 2, amount: 100, buy_price: 50.5 },
            { id: 3, user_id: 2, ticker_id: 2, amount: 300, buy_price: 60.0 },
        ];

        mockConnection.query.mockResolvedValueOnce([mockTransactions]);
        jest.spyOn(Transaction, "fromDatabase").mockImplementation(data => data);

        const result = await TransactionService.getTransactionsByTickerId(2);

        expect(mockConnection.query).toHaveBeenCalledWith(
            "SELECT * FROM transaction WHERE ticker_id = ?", [2]
        );
        expect(result).toEqual(mockTransactions);
    });
});
