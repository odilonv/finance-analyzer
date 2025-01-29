import React from 'react';

const TransactionComponent = ({ ticker_id, amount, buy_price }) => {
    return (
        <div style={{ border: "1px solid #ddd", padding: "10px", margin: "5px", borderRadius: "5px" }}>
            <p><strong>{ticker_id}</strong></p>
            <p>Amount: {amount}</p>
            <p>Buy Price: ${buy_price}</p>
        </div>
    );
};

export default TransactionComponent;
