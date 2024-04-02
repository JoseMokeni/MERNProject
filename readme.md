# MERN Stack Marketplace

This is a full-stack marketplace application built using the MERN stack (MongoDB, Express, React, Node.js).

## Running the App Locally

To run the application locally, follow these steps:

1. Clone the repository to your local machine.

2. Navigate to the root directory of the project in your terminal.

3. Run the following command to install the dependencies for the backend:

```bash
cd backend
npm install
```

4. Run the following command to install the dependencies for the frontend:

```bash
cd frontend
npm install
```

5. Create a .env file in the backend folder, using the .env.example file as a template. Replace the placeholder values with your actual data.

6. Run the following command to start the backend server:

```bash
cd backend
npm start
```

7. Open a new terminal window and run the following command to start the frontend server:

```bash
cd frontend
npm start
```

8. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Running the App with Docker Compose

To run the application using Docker Compose, follow these steps:

1. Ensure Docker and Docker Compose are installed on your machine. If not, you can download them from [Docker's official website](https://www.docker.com/products/docker-desktop).

2. Navigate to the root directory of the project in your terminal.

3. Run the following command to start the application:

```bash
docker-compose up
```

## Setting Up the .env File

The backend of this application requires a .env file to function correctly. This file should be located in the backend folder of the project.

You can create this file by copying the .env.example file in the same directory and renaming it to .env. Then, replace the placeholder values with your actual data.

## MongoDB Configuration

Currently, this application is configured to use MongoDB Atlas for database operations. The MongoDB instance is not dockerized.

We plan to create a new branch soon that will include Docker configurations for the backend, frontend, and MongoDB.

Stay tuned for updates!
