Steps to Build and Run
1.Navigate to the project root directory:
Example: "cd /Users/namnguyenvu/Downloads/seng-513-project"

2.Build and start the containers:
docker compose up --build

2.1.If issue presist,
First, use docker compose down -v, then docker compose up --build

3.Access the application:

Backend: http://localhost:3000
Frontend: http://localhost:8080

Database Access:
MySQL is exposed on port 3306. You can connect using a MySQL client.

To run the AI (if the key is invalid), please go to "https://console.groq.com/keys" to create an API key