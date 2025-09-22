# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PGE Vibe is a Spring Boot application that processes PGE electric usage data from CSV files and stores it in an H2 in-memory database. The project consists of a Java backend and a React frontend.

## Development Commands

### Backend (Spring Boot)
- **Run application**: `mvn spring-boot:run`
- **Build project**: `mvn clean package`
- **Run tests**: `mvn test`
- **Clean build**: `mvn clean`

### Frontend (React UI)
Navigate to `/ui` directory first:
- **Install dependencies**: `npm install`
- **Start development server**: `npm start`
- **Build for production**: `npm run build`
- **Run tests**: `npm test`

## Application Architecture

### Backend Structure
- **Main Application**: `src/main/java/com/pge/vibe/PgeVibeApplication.java`
- **Entities**:
  - `AccountInfo.java` - Customer account information
  - `ElectricUsage.java` - Hourly usage data records
- **Repositories**: Spring Data JPA repositories for data access
- **Controller**: `ElectricUsageController.java` - REST API endpoints
- **Service**: `CsvParsingService.java` - CSV file processing logic

### Database Schema
- **H2 In-Memory Database**: Accessible at `http://localhost:8181/h2-console`
  - JDBC URL: `jdbc:h2:mem:pgedb`
  - Username: `sa`
  - Password: (blank)
- **Tables**:
  - `account_info` - Customer details
  - `electric_usage` - Time-series usage data

### API Endpoints
Base URL: `http://localhost:8181/api/usage`
- **POST** `/upload` - Upload PGE CSV files
- **GET** `/all` - Get all usage records
- **GET** `/accounts` - Get all account information
- **GET** `/account/{accountId}` - Get usage by account
- **GET** `/account/{accountId}/range` - Get usage by date range
- **GET** `/account/{accountId}/recent` - Get recent usage
- **DELETE** `/all` - Delete all records

### Frontend Structure
- **React 19** with React Router for navigation
- **Development server**: Runs on `http://localhost:3000`
- **API Integration**: Connects to backend at `http://localhost:8181`

## CSV File Format
The application expects PGE CSV files with:
1. Header section with account metadata (Name, Address, Account Number, Service)
2. Data section with hourly usage records (TYPE, DATE, START TIME, END TIME, USAGE, COST, NOTES)

## Key Technologies
- **Backend**: Spring Boot 3.2.0, Spring Data JPA, H2 Database, OpenCSV
- **Frontend**: React 19, React Router DOM
- **Build Tools**: Maven (backend), npm (frontend)
- **Java Version**: 17

## File Upload Configuration
- Maximum file size: 10MB
- Supported format: CSV files from PGE
- Upload endpoint accepts multipart form data with `file` parameter