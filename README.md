# Finance Analyzer

Finance Analyzer is a powerful and user-friendly application designed to simplify the management of stock data and portfolios. Whether you're an experienced investor or a beginner, this tool offers essential features to help you stay informed and manage your investments effectively.

## Features

1. **Stock Data Visualization**  
   View comprehensive data for a wide range of stocks, including key metrics, performance charts, and other relevant information.

2. **Company News Integration**  
   Click on a stock to instantly access the latest news and updates about the associated company. Stay informed about critical events and announcements that may impact your investments.

3. **Personal Stock Portfolio Management**  
   Create and manage your own stock portfolio. Keep track of your holdings and monitor your investments' performance over time.

---

### Authors

- ESCLAPEZ Loïc
- DIMECK Raphaël
- VIDAL Odilon

---

### Installation

To install Finance Analyzer, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the cloned directory.
3. Run the following command to install the frontend and backend dependencies:

    ```
    npm install
    ```

---

### Installation de la base de données

To install and configure the database for Finance Analyzer, follow these steps:

1. Start the Docker containers:

    ```
    npm run database
    ```

2. Configure the database connection:
    - Name : `finance-analyzer`
    - Host : `localhost`
    - Port : `3306`
    - User : `admin`
    - Password : `admin`
    - Database : `finance_analyzer_db`
    - URL : `jdbc:mysql://localhost:3307/finance_analyzer_db`

---

### Usage
To run the application in development mode, execute the following command:

    npm run dev

This will start the backend server and launch the frontend.

---

### Available Scripts

- `npm run client`: Starts the frontend.
- `npm run server`: Starts the backend server.
- `npm run dev`:  Starts both the backend server and the frontend in development mode.
- `npm test`:  Runs the tests. (Currently unspecified)

---

### Licence

This project is licensed under the MIT License.

---

