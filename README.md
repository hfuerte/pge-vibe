# PGE Vibe - Electric Usage Tracker

A Spring Boot application with React frontend that processes PGE electric usage data from CSV files and PDF statements. Stores data in an in-memory H2 database with comprehensive analytics and reporting features.

## Features

- **CSV File Processing**: Upload and parse PGE CSV files with account information and hourly usage data
- **PDF Statement Processing**: Extract billing period information from PGE PDF statements using OCR
- **In-Memory Database**: Uses H2 database for fast data storage and retrieval
- **REST API**: Comprehensive endpoints for data management and retrieval
- **React Frontend**: Modern web interface with navigation, file uploads, and data visualization
- **Account Management**: Stores customer account information (name, address, account number, service type)
- **Usage Analytics**: Query usage data by account, date range, or recent activity
- **Smart Summaries**: Time-block analysis with billing period filtering
- **Runtime Logging**: Comprehensive logging for troubleshooting and monitoring

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js and npm (for React frontend)
- Tesseract OCR (for PDF processing)
  ```bash
  # On macOS with Homebrew
  brew install tesseract
  ```

### Quick Start

The easiest way to run both backend and frontend:

```bash
# Make the start script executable
chmod +x start.sh

# Start both backend and frontend
./start.sh
```

This will:
- Build the Spring Boot backend
- Install React dependencies
- Start backend on `http://localhost:8181`
- Start frontend on `http://localhost:3000`

### Manual Setup

#### Backend Only
```bash
mvn spring-boot:run
```

#### Frontend Only
```bash
cd ui
npm install
npm start
```

### Application URLs

- **Frontend (React)**: `http://localhost:3000`
- **Backend API**: `http://localhost:8181`
- **H2 Database Console**: `http://localhost:8181/h2-console`
  - JDBC URL: `jdbc:h2:mem:pgedb`
  - Username: `sa`
  - Password: (leave blank)

## CSV File Format

The application expects CSV files in the following PGE format:

```csv
Name,[Customer Name]
Address,"[Customer Address]"
Account Number,[Account Number]
Service,[Service Type]

TYPE,DATE,START TIME,END TIME,USAGE (kWh),COST,NOTES
Electric usage,YYYY-MM-DD,HH:MM,HH:MM,[Usage in kWh],[$Cost],[Optional Notes]
Electric usage,YYYY-MM-DD,HH:MM,HH:MM,[Usage in kWh],[$Cost],[Optional Notes]
```

## API Endpoints

### File Upload
- **POST** `/api/usage/upload`
  - Upload a PGE CSV file
  - Form parameter: `file` (multipart file)
  - Returns: Success message with number of processed records

- **POST** `/api/usage/upload-statement`
  - Upload a PGE PDF statement to extract billing period information
  - Form parameter: `file` (PDF file)
  - Returns: JSON with start date, end date, and billing days

### Usage Data Retrieval
- **GET** `/api/usage/all`
  - Get all usage records
  
- **GET** `/api/usage/account/{accountId}`
  - Get all usage records for a specific account
  
- **GET** `/api/usage/account/{accountId}/range`
  - Get usage records for a date range
  - Parameters: `startDate`, `endDate` (format: YYYY-MM-DD)
  
- **GET** `/api/usage/account/{accountId}/recent`
  - Get recent usage records
  - Parameter: `days` (default: 30)

### Account Management
- **GET** `/api/usage/accounts`
  - Get all account information

### Data Management
- **DELETE** `/api/usage/all`
  - Delete all usage records

## Example Usage

### 1. Upload CSV File
```bash
curl -X POST -F "file=@your-pge-data.csv" http://localhost:8181/api/usage/upload
```

### 2. Upload PDF Statement
```bash
curl -X POST -F "file=@your-pge-statement.pdf" http://localhost:8181/api/usage/upload-statement
```

### 3. Get All Usage Data
```bash
curl http://localhost:8181/api/usage/all
```

### 4. Get Account Information
```bash
curl http://localhost:8181/api/usage/accounts
```

### 5. Get Usage by Date Range
```bash
curl "http://localhost:8181/api/usage/account/[ACCOUNT_NUMBER]/range?startDate=2025-01-01&endDate=2025-01-31"
```

### 6. Get Recent Usage (Last 7 Days)
```bash
curl "http://localhost:8181/api/usage/account/[ACCOUNT_NUMBER]/recent?days=7"
```

## Database Schema

### Account Info Table
- `id` (Primary Key)
- `account_number` (Unique)
- `name`
- `address`
- `service_type`
- `created_at`

### Electric Usage Table
- `id` (Primary Key)
- `account_id`
- `usage_date`
- `start_time`
- `end_time`
- `usage_kwh`
- `cost`
- `notes`
- `created_at`

## Configuration

The application uses the following default configuration:

- **Database**: H2 in-memory database
- **File Upload**: Maximum 10MB file size
- **Logging**: DEBUG level for application packages

## Development

### Building the Project
```bash
mvn clean package
```

### Running Tests
```bash
mvn test
```

## Frontend Features

The React frontend provides:

- **Dashboard**: View all account information
- **File Uploads**: Upload CSV data and PDF statements
- **Usage Analysis**: View usage data by account with filtering
- **Smart Summaries**: Time-block analysis with hourly breakdowns
- **PDF Integration**: Extract billing periods and filter summaries by date range
- **Data Management**: Delete data and manage accounts

### Navigation
- **Accounts**: View all customer accounts
- **All Usage**: Browse all usage records
- **Usage By Account**: Filter and analyze specific accounts
- **Upload CSV**: Upload PGE CSV data files
- **Upload PDF Statement**: Extract billing period from PDF statements
- **Summary**: Advanced analytics with time-block filtering
- **Delete Data**: Data management tools

## Technologies Used

### Backend
- **Spring Boot 3.2.0**: Main framework
- **Spring Data JPA**: Database operations
- **H2 Database**: In-memory database
- **OpenCSV**: CSV file parsing
- **Apache PDFBox**: PDF text extraction
- **Tesseract OCR**: PDF text recognition
- **Maven**: Build and dependency management

### Frontend
- **React 19**: Modern UI framework
- **React Router**: Navigation and routing
- **JavaScript ES6+**: Modern JavaScript features
- **CSS3**: Responsive styling
- **npm**: Package management

## Uploading Data with Bruno

For a more user-friendly way to upload your CSV data, you can use the [Bruno](https://www.usebruno.com/) API client.

### Setup Instructions

1.  **Create a New Request:**
    *   In your Bruno collection, create a new request and name it something descriptive, like `Upload Usage CSV`.

2.  **Set the HTTP Method and URL:**
    *   Change the HTTP method to **POST**.
    *   Set the URL to: `http://localhost:8181/api/usage/upload`

3.  **Configure the Request Body:**
    *   Click on the **Body** tab.
    *   Select the body type **Multipart Form**.

4.  **Add the File:**
    *   In the form fields table, create a new entry:
        *   Set the **Name** to `file`.
        *   Change the type from `Text` to **File**.
        *   Select your CSV file (e.g., `pge_electric_usage_interval_data_Service 2_2_2025-01-01_to_2025-06-18.csv`).

5.  **Send the Request:**
    *   Click the **Send** button to upload the file and populate the database.

## Running the UI

This project includes a React-based user interface for viewing account information.

### Prerequisites

- Node.js and npm

### Running the UI

1. **Navigate to the UI directory**
   ```bash
   cd ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The UI will be available at `http://localhost:3000` and will connect to the backend API running on `http://localhost:8181`.

## Logging and Troubleshooting

The application includes comprehensive logging for troubleshooting:

### Backend Logs
- **Location**: `logs/pge-vibe.log`
- **Rolling**: 50MB max size, 30 days retention
- **Levels**: DEBUG for application code, WARN for external libraries

### Frontend Logs
- **Browser Console**: JavaScript errors and debug info
- **localStorage**: Persistent logs across page refreshes
- **Download**: Export logs as JSON for analysis

### Common Issues

#### Tesseract OCR Not Working
If PDF upload fails with Tesseract errors:
```bash
# Install Tesseract OCR
brew install tesseract

# Verify installation
tesseract --version

# Restart the application
./start.sh
```

#### Port Conflicts
If ports 8181 or 3000 are in use:
- Backend: Change `server.port` in `src/main/resources/application.yml`
- Frontend: Set `PORT=3001 npm start` in the `ui` directory