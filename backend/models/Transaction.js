import databaseConnection from './DatabaseConnection.js';
import bcrypt from 'bcrypt';

class Ticker {
    static tableName = 'ticker';
    static fields = ['id', 'user_id', 'ticker_id', 'amount', 'buy_price'];

    constructor(id, user_id, ticker_id, amount, buy_price) {
        this.id = id;
        this.user_id = user_id;
        this.ticker_id = ticker_id;
        this.amount = amount;
        this.buy_price = buy_price;
    }

    static fromDatabase(data) {
        return new Ticker(data.id, data.user_id, data.ticker_id, data.amount, data.buy_price);
    }

    static fromJson(data) {
        return new Ticker(data.id, data.user_id, data.ticker_id, data.amount, data.buy_price);
    }
}

export default Ticker;