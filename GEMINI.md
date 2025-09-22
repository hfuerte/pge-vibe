# Gemini Project Configuration (GEMINI.md)

This file provides context and instructions for the Gemini AI assistant to follow when working on the `pge-vibe` project.

## Project Overview

This project is a full-stack application.
- The backend is a Java Spring Boot application managed with Maven.
- The frontend is a React application located in the `ui/` directory.

## Backend (Java/Spring Boot)

- **Build Command:** To build the entire project, run `mvn clean install` from the root directory.
- **Run Command:** To start the Spring Boot application, run `mvn spring-boot:run` from the root directory.
- **Source Code:** Backend source code is located in `src/main/java/`.
- **Dependencies:** Backend dependencies are managed in `pom.xml`.

## Frontend (React)

- **Directory:** The frontend code is in the `ui/` directory.
- **Install Dependencies:** Run `npm install --prefix ui` to install frontend dependencies.
- **Run Development Server:** Run `npm start --prefix ui` to start the React development server.
- **Run Tests:** Run `npm test --prefix ui` to execute frontend tests.

## General Guidelines

- **Code Style:** Please adhere to the existing code style in the files you modify.
- **Commits:** (If applicable, add your project's commit message conventions here).
- **API Changes:** When making changes to the backend API, ensure the corresponding frontend code in the `ui/` directory is also updated.
