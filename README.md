# Finance Analyzer

Finance Analyzer is a powerful and user-friendly application designed to simplify the management of stock data and portfolios. Whether you're an experienced investor or a beginner, this tool offers essential features to help you stay informed and manage your investments effectively.

## Features

1. **Stock Data Visualization**  
   View comprehensive data for a wide range of stocks, including key metrics, performance charts, and other relevant information.

2. **Company News Integration**  
   View the latest news and updates related to all tracked stocks. This feature aggregates and displays relevant financial news, reports, and market events that may influence the stocks in your portfolio.

3. **Personal Stock Portfolio Management**  
   Create and manage your own stock portfolio within the platform. Track your holdings, analyze their performance, and adjust your strategy as needed to achieve your investment goals.

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

### Running the Application Locally


To run the application in development mode, execute the following command:

  > **Note for Windows or Mac users**: Before running `npm run dev`, make sure `Docker Desktop` is running on your machine.


    npm run dev


This will start the backend server and launch the frontend.

---

### Testing

The current version of the application includes tests that can be run using the following command:

    npm test

Ensure your environment is set up correctly before running the tests to verify the functionality of the application.

---

### Available Scripts

- `npm run client`: Starts the frontend.
- `npm run server`: Starts the backend server.
- `npm run dev`:  Starts both the backend server and the frontend in development mode.
- `npm test`:  Runs the tests.

---

### Database Setup (Not necessary)

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

### Licence

This project is licensed under the MIT License.

---

