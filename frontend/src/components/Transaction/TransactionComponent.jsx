import React from 'react';

const TransactionComponent = ({ ticker_id, amount, buy_price }) => {
    return (
        <div class="transaction">
            <div class="ticker-id"><strong>{ticker_id}</strong></div>
            <div class="amount">{amount}</div>
            <div class="buy-price"> ${buy_price}</div>
        </div>
    );
};

export default TransactionComponent;
