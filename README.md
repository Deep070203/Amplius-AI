# Amplius-AI
Amplius-AI is an end-to-end Agentic Chat Platform where you can create agents and chat with them.

## Demo

Link: https://youtu.be/PolmqHusj6s


Clone the repository.

Create a `.env` file in the backend directory of your project and add the following variables:

```env
GROQ_API_KEY=your_groq_api_key
DB_USER=your_username
DB_HOST=localhost
DB_NAME=your_postgresql_db_name
DB_PASSWORD=your_password
DB_PORT=5432
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
``` 

Split the terminals and change the first directory to frontend and other to backend

Install necessary dependencies by writing this in both terminals:
```bash
npm i
```

### To run the Application

For frontend (Will run on Localhost 5173):

```bash
npm run dev
```

For backend (Will run on 5002 port):
```bash
node index.js
```

Sometimes, the Axios posts error when returning LLM response. Just close the window and restart both server and frontend!

Features:
1. Give them guidance on how they should behave and what they should talk about
2. Add files and chat with them (TODO: PDF viewer)
3. Produces Formatted code that user can copy
4. Produces Diagrams(Sequence, Gantt, Pie Chart etc.)
5. More features are coming!
