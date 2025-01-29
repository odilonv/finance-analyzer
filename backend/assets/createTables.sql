CREATE TABLE IF NOT EXISTS `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR (255) NOT NULL,
    lastName VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `transaction` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    ticker_id VARCHAR(255) NOT NULL,
    amount FLOAT NOT NULL,
    buy_price FLOAT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES `user`(id)
);
