# Finance Dashboard Backend API

A RESTful backend API for a finance dashboard built with **Node.js** and **Express**. Uses in-memory storage (no database required).

---

## Steps to Run the project

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
node index.js
```

Server runs at: `http://localhost:3000`

---

## Authentication & Role Simulation

All protected endpoints require the `x-user-role` header to simulate role-based access.

| Role      | Permissions                                 |
|-----------|---------------------------------------------|
| `viewer`  | `GET /summary` only                         |
| `analyst` | `GET /records`, `GET /summary`              |
| `admin`   | Full access (all endpoints)                 |

**Example header:** `x-user-role: admin`

---

## API Endpoints

### Users

| Method | Endpoint | Description         |
|--------|----------|---------------------|
| POST   | /users   | Create a new user   |
| GET    | /users   | List all users      |

**POST /users — Request Body**
```json
{
  "name": "Alice",
  "role": "analyst",
  "status": "active"
}
```

---

### Financial Records

| Method | Endpoint        | Role Required      | Description           |
|--------|-----------------|--------------------|-----------------------|
| POST   | /records        | admin              | Create a record       |
| GET    | /records        | analyst, admin     | List all records      |
| DELETE | /records/:id    | admin              | Delete a record by ID |

**POST /records — Request Body**
```json
{
  "amount": 1500,
  "type": "income",
  "category": "Salary",
  "date": "2025-04-01",
  "note": "Monthly salary"
}
```

**GET /records — Optional Query Params**
```
GET /records?type=income
GET /records?category=Salary
GET /records?type=expense&category=Rent
```

---

### Dashboard Summary

| Method | Endpoint  | Role Required            | Description                     |
|--------|-----------|--------------------------|----------------------------------|
| GET    | /summary  | viewer, analyst, admin   | Total income, expenses, balance |

**Response:**
```json
{
  "totalIncome": 5000.00,
  "totalExpenses": 2000.00,
  "netBalance": 3000.00
}
```

---

## Testing with cURL

```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","role":"admin","status":"active"}'

# Create a record (admin)
curl -X POST http://localhost:3000/records \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{"amount":2000,"type":"income","category":"Salary","date":"2025-04-01","note":"April salary"}'

# Get all records (analyst or admin)
curl http://localhost:3000/records -H "x-user-role: analyst"

# Filter records by type
curl "http://localhost:3000/records?type=income" -H "x-user-role: admin"

# Get summary (any role)
curl http://localhost:3000/summary -H "x-user-role: viewer"

# Delete a record (admin)
curl -X DELETE http://localhost:3000/records/<record-id> -H "x-user-role: admin"
```

---

## Project Structure

```
finance-dashboard-backend/
├── index.js                  # Entry point
├── package.json
├── data/
│   └── store.js              # In-memory arrays (users, records)
├── middleware/
│   └── roleCheck.js          # RBAC middleware
├── controllers/
│   ├── userController.js
│   ├── recordController.js
│   └── summaryController.js
├── routes/
│   ├── users.js
│   ├── records.js
│   └── summary.js
└── utils/
    └── validate.js           # Field validation helpers
```

---

## Notes

- All data is **in-memory** — it resets when the server restarts.
- No authentication is implemented; role is mocked via the `x-user-role` header.
- `status` field on users defaults to `active` if not provided.
- `note` field on records is optional.
