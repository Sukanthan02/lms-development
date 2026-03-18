# LMS Backend

A Node.js backend template for building RESTful APIs with Express.js and Sequelize ORM.

## Features

- Express.js server setup
- Sequelize ORM with MySQL database
- CORS middleware enabled
- Body parser for JSON and URL-encoded data
- Environment variable configuration
- Modular folder structure with controllers and models
- Development server with hot reload (nodemon)
- Sample User and Course models with relationships

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL Server (v5.7 or higher)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your MySQL configuration:
   ```
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=lms_db
   DB_USER=root
   DB_PASSWORD=your_password
   DB_DIALECT=mysql
   ```

4. Create the database (if not exists):
   ```sql
   CREATE DATABASE lms_db;
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

The server will start with hot reload enabled using nodemon on port 3000.

### Production Mode
```bash
npm start
```

## Project Structure

```
src/
├── server.js           # Main application entry point
├── routes/             # API route handlers
│   └── users.js       # User routes
├── middleware/         # Custom middleware
├── controllers/        # Business logic
│   └── userController.js
├── models/             # Sequelize models
│   ├── index.js       # Database connection and model initialization
│   ├── User.js        # User model
│   └── Course.js      # Course model
└── utils/              # Utility functions
    ├── responseFormatter.js
    └── seeder.js      # Database seeder

config/
├── database.js        # Database configuration by environment
tests/
.env.example           # Environment variables template
```

## Database Models

### User Model
- `id` - Primary Key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password (plain text in seeder for demo)
- `role` - User role (admin, instructor, student)
- `isActive` - Account status
- `createdAt` - Created timestamp
- `updatedAt` - Updated timestamp

### Course Model
- `id` - Primary Key
- `title` - Course title
- `description` - Course description
- `instructorId` - Foreign key to instructor (User)
- `duration` - Course duration in hours
- `maxStudents` - Maximum number of students
- `isActive` - Course status
- `createdAt` - Created timestamp
- `updatedAt` - Updated timestamp

## API Endpoints

### Health Check
- `GET /api/health` - Returns server status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Example requests:
```bash
# Get all users
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Student",
    "email": "student@example.com",
    "password": "password123",
    "role": "student"
  }'

# Get specific user
curl http://localhost:3000/api/users/1

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "role": "instructor"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lms_db
DB_USER=root
DB_PASSWORD=password
DB_DIALECT=mysql
```

## Dependencies

- **express** - Web framework
- **cors** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management
- **body-parser** - Request body parsing middleware
- **sequelize** - ORM for database
- **mysql2** - MySQL driver for Sequelize

## Dev Dependencies

- **nodemon** - Automatic server restart on file changes
- **jest** - Testing framework

## Sequelize Configuration

The database configuration is in `config/database.js` with environment-specific settings:

- **Development**: Logs SQL queries, connection pooling enabled
- **Test**: No logging, separate test database
- **Production**: Optimized connection pool, no logging

### Adding New Models

1. Create a new model file in `src/models/` following the User.js pattern
2. Export the model function with proper DataTypes
3. Define associations if needed in the model's `associate` method
4. Models are automatically loaded in `src/models/index.js`

### Creating Migrations

For production use, consider installing Sequelize CLI:
```bash
npm install --save-dev sequelize-cli
```

Then create migrations instead of using `sync()`.

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## Notes

- The User model currently stores passwords in plain text. In production, implement password hashing with bcrypt.
- Database seeder is available in `src/utils/seeder.js` for initial data setup.
- Modify `config/database.js` to add connection pooling and other optimizations as needed.

## License

ISC
