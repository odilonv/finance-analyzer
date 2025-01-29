async function createTransaction(transaction) {
    const response = await fetch('http://localhost:5002/transactions/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transaction })
    });
    if (response.status === 201) {
        return await response.json();
    } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error);
    }
}

async function updateTransaction(transactionId, transaction) {
    const response = await fetch(`http://localhost:5002/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transaction })
    });
    if (response.status === 200) {
        return await response.json();
    } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error);
    }
}

async function deleteTransaction(transactionId) {
    const response = await fetch(`http://localhost:5002/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if (response.status === 200) {
        return await response.json();
    } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error);
    }
}

async function getTransactionById(transactionId) {
    const response = await fetch(`http://localhost:5002/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if (response.status === 200) {
        return await response.json();
    } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error);
    }
}

async function getTransactionsByUserId(userId) {
    const response = await fetch(`http://localhost:5002/transactions/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if (response.status === 200) {
        return await response.json();
    } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error);
    }
}

async function getTransactionsByTickerId(tickerId) {
    const response = await fetch(`http://localhost:5002/transactions/ticker/${tickerId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if (response.status === 200) {
        return await response.json();
    } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error);
    }
}

export { createTransaction, updateTransaction, deleteTransaction, getTransactionById, getTransactionsByUserId, getTransactionsByTickerId };