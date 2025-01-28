CREATE TABLE IF NOT EXISTS `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR (255) NOT NULL,
    lastName VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `wallet` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,

);

CREATE TABLE IF NOT EXISTS `user_validation` (
    user_id INT,
    email_token VARCHAR(255),
    validated BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES user(id)
);