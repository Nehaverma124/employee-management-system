# Employee Management System — REST API

A Spring Boot REST API for managing employee records, built with Spring Boot, Spring Data JPA (Hibernate), and MySQL. Supports full CRUD operations, search/filtering, pagination, input validation, and centralized exception handling.

## Tech Stack
- Java 17
- Spring Boot 3.2.5
- Spring Data JPA / Hibernate
- MySQL 8
- Maven
- Lombok

## Prerequisites
- JDK 17+
- MySQL 8 installed and running
- Maven (or use the included `mvnw` wrapper — see note below)

## Setup

1. **Clone / unzip the project**, then navigate into it:
   ```bash
   cd employee-management-system
   ```

2. **Create the database** (optional — the app can auto-create it):
   ```sql
   CREATE DATABASE employee_db;
   ```

3. **Configure your MySQL credentials** in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/employee_db?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

4. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```
   The API will start on `http://localhost:8080`.

   > Note: This project doesn't include the Maven wrapper (`mvnw`) files. If you don't have Maven installed locally, run `mvn -N io.takari:maven:wrapper` once inside the project folder to generate it, or install Maven directly.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST   | `/api/employees` | Create a new employee |
| GET    | `/api/employees?page=0&size=10` | Get all employees (paginated) |
| GET    | `/api/employees/{id}` | Get a single employee by ID |
| GET    | `/api/employees/department/{department}` | Get employees by department |
| GET    | `/api/employees/search?minSalary=30000&maxSalary=80000` | Get employees within a salary range |
| PUT    | `/api/employees/{id}` | Update an existing employee |
| DELETE | `/api/employees/{id}` | Delete an employee |

## Sample Request — Create Employee

`POST /api/employees`

```json
{
  "name": "Neha Varma",
  "email": "neha.varma@example.com",
  "department": "Engineering",
  "salary": 55000,
  "joiningDate": "2026-01-15"
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "name": "Neha Varma",
  "email": "neha.varma@example.com",
  "department": "Engineering",
  "salary": 55000,
  "joiningDate": "2026-01-15"
}
```

**Validation Error Response (400 Bad Request)** — e.g. missing name and invalid email:
```json
{
  "timestamp": "2026-07-07T10:15:30",
  "status": 400,
  "error": "Validation Failed",
  "fieldErrors": {
    "name": "Name is required",
    "email": "Email must be a valid email address"
  }
}
```

**Duplicate Email Error (409 Conflict):**
```json
{
  "timestamp": "2026-07-07T10:16:00",
  "status": 409,
  "error": "Conflict",
  "message": "An employee with email 'neha.varma@example.com' already exists"
}
```

**Not Found Error (404):**
```json
{
  "timestamp": "2026-07-07T10:17:00",
  "status": 404,
  "error": "Not Found",
  "message": "Employee not found with id: 99"
}
```

## Testing with Postman
1. Import the endpoints above into a new Postman collection.
2. Set `Content-Type: application/json` on POST/PUT requests.
3. Test the happy path first (valid create → get → update → delete), then test edge cases (invalid email, duplicate email, non-existent ID) to demonstrate the validation and error handling.
4. Take screenshots of a few requests/responses for your GitHub README — this is what recruiters actually look at.

## Project Structure
```
src/main/java/com/neha/employeemanagement/
├── EmployeeManagementSystemApplication.java   # Entry point
├── model/Employee.java                         # Entity + validation annotations
├── repository/EmployeeRepository.java          # Spring Data JPA repository
├── service/EmployeeService.java                # Business logic
├── controller/EmployeeController.java          # REST endpoints
└── exception/
    ├── ResourceNotFoundException.java
    ├── DuplicateResourceException.java
    └── GlobalExceptionHandler.java              # Centralized error handling
```

## Possible Extensions (if you want to go further)
- Add Swagger/OpenAPI docs (`springdoc-openapi`) for interactive API documentation
- Add Spring Security with JWT for authentication
- Add a `Department` entity with a one-to-many relationship to `Employee`
- Write unit tests for the service layer using Mockito
- Dockerize the app with a `Dockerfile` + `docker-compose.yml` (MySQL + app)

## Author
Neha Varma
