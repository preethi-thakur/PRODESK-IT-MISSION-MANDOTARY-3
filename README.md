# PRODESK-IT-MISSION-MANDOTARY-3
Class Waitlist SMS Notification System is a full-stack web application for managing classes, waitlists, and mock SMS notifications. Built with React, Node.js, Express, Prisma, and PostgreSQL, it provides CRUD operations, validation, analytics, and a responsive user interface.
# Class Waitlist SMS Notification System

A full-stack web application for managing classes, waitlists, and mock SMS notifications. Users can create and manage classes, maintain waitlists, simulate SMS notifications, and view real-time analytics through an intuitive dashboard.

## Features

- Class Management (CRUD)
- Waitlist Management
- Mock SMS Notifications
- Dashboard & Analytics
- Responsive Design
- Form Validation
- RESTful API
- PostgreSQL Database

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Query
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Zod



## Installation

```bash
git clone https://github.com/preethi-thakur/PRODESK-IT-MISSION-MANDOTARY-3
cd class-waitlist-sms-system
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/class_waitlist"
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000/api
```

## Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

## Run the Project

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes` | Get all classes |
| POST | `/api/classes` | Create a class |
| PUT | `/api/classes/:id` | Update a class |
| DELETE | `/api/classes/:id` | Delete a class |
| GET | `/api/waitlist` | Get waitlist entries |
| POST | `/api/waitlist` | Add to waitlist |
| DELETE | `/api/waitlist/:id` | Remove waitlist entry |
| GET | `/api/notifications` | Get notifications |
| POST | `/api/notifications/send` | Send mock SMS |
| GET | `/api/dashboard/stats` | Dashboard statistics |

## Dashboard

- Total Classes
- Waitlist Entries
- Notifications Sent
- Pending Notifications
- Delivered Notifications
- Failed Notifications

## Future Enhancements

- Authentication
- Role-Based Access Control
- Real SMS Integration
- Email Notifications
- Advanced Reports
- Search & Pagination

## Author

**Swobhagya Sahoo**

## License

This project is for educational purposes.
