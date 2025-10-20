# RM365 Toolbox

> **IMPORTANT NOTICE**: This repository contains a redacted version of the codebase. All sensitive information including frontend URLs, backend API endpoints, database connections, and authentication secrets have been removed or modified to protect private company assets.

A comprehensive business management platform for RM365, featuring attendance tracking, inventory management, label generation, and sales data processing. Built with FastAPI and vanilla JavaScript for maximum performance and reliability.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

## 🚀 Applications

> **Note**: All production URLs and endpoints have been redacted for security purposes.

- **Frontend**: Configure in frontend/js/config.js (production URLs removed)
- **Backend API**: Configure in backend/core/config.py (production endpoints removed)
- **API Documentation**: Available at /api/docs when running locally

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Modules

- **👥 User Management**: Authentication, roles, and permissions
- **📊 Attendance Tracking**: Clock in/out, logs, reports, analytics
- **📦 Inventory Management**: Stock tracking, adjustments, Zoho sync
- **🏷️ Label Generation**: PDF labels with barcodes
- **📁 Sales Imports**: CSV upload and data processing
- **🎓 Enrollment**: Student/employee registration and hardware

### 🔧 Technical Features

- **🔐 JWT Authentication**: Secure token-based auth
- **🎯 Role-Based Access Control**: Granular permissions
- **🌐 RESTful API**: Clean, versioned endpoints
- **📱 Progressive Web App**: Mobile-optimized
- **🔄 Real-time Updates**: Live data synchronization
- **🌙 Dark Mode**: Built-in theme switching
- **📈 Analytics**: Charts and reporting

---

## 🛠 Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **Pydantic**: Data validation
- **PostgreSQL**: Primary database
- **JWT**: Authentication
- **Uvicorn**: ASGI server

### Frontend
- **Vanilla JavaScript**: No framework dependencies
- **Modern CSS**: Grid, Flexbox, custom properties
- **Web Components**: Reusable UI elements
- **Service Workers**: Offline support

### Infrastructure
- **Railway**: Backend hosting
- **Cloudflare Pages**: Frontend hosting
- **GitHub Actions**: CI/CD
- **Docker**: Containerization

---

## 📁 Project Structure

```
RM365-Toolbox/
├── backend/                      # FastAPI backend
│   ├── app.py                   # Main application
│   ├── core/                    # Core functionality
│   │   ├── auth.py             # JWT authentication
│   │   ├── config.py           # Settings
│   │   ├── db.py               # Database connections
│   │   └── security.py         # Security utils
│   │
│   ├── common/                  # Shared code
│   │   ├── deps.py             # Dependencies
│   │   ├── dto.py              # Data transfer objects
│   │   └── utils.py            # Utilities
│   │
│   └── modules/                 # Feature modules
│       ├── attendance/         # Attendance tracking
│       ├── enrollment/         # User enrollment
│       ├── inventory/          # Stock management
│       ├── labels/             # Label generation
│       ├── sales_imports/      # Data imports
│       └── users/              # User management
│
├── frontend/                    # Vanilla JS frontend
│   ├── index.html              # Main app shell
│   ├── components/             # UI components
│   ├── css/                    # Stylesheets
│   ├── html/                   # Page templates
│   └── js/                     # JavaScript modules
│       ├── modules/            # Feature modules
│       ├── services/           # API services
│       ├── ui/                 # UI utilities
│       └── utils/              # Shared utilities
│
├── railway.json                 # Railway config
└── README.md                    # This file
```

See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for detailed module documentation.

---

## 💻 Development

### Prerequisites

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **PostgreSQL** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)

---

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI**: `/api/docs` - Test endpoints directly
- **ReDoc**: `/api/redoc` - Alternative docs view
- **OpenAPI Spec**: `/api/openapi.json` - Full specification

### Main API Endpoints

#### Authentication
```
POST   /api/v1/auth/login          - User login
POST   /api/v1/auth/refresh        - Refresh token
```

#### Users
```
GET    /api/v1/users               - List all users
GET    /api/v1/users/detailed      - Get users with details
POST   /api/v1/users               - Create new user
PATCH  /api/v1/users               - Update user
DELETE /api/v1/users               - Delete user
```

#### Roles
```
GET    /api/v1/roles               - List all roles
GET    /api/v1/roles/:name         - Get role details
POST   /api/v1/roles               - Create role
PATCH  /api/v1/roles               - Update role
DELETE /api/v1/roles               - Delete role
```

#### Attendance
```
GET    /api/v1/attendance/employees         - List employees
GET    /api/v1/attendance/employees/status  - Employee status
POST   /api/v1/attendance/clock            - Clock in/out
GET    /api/v1/attendance/logs             - Get attendance logs
GET    /api/v1/attendance/daily-stats      - Daily statistics
GET    /api/v1/attendance/weekly-chart     - Weekly chart data
```

#### Inventory
```
GET    /api/v1/inventory/management         - List items
POST   /api/v1/inventory/management         - Create item
PATCH  /api/v1/inventory/management         - Update item
DELETE /api/v1/inventory/management/:id     - Delete item
GET    /api/v1/inventory/adjustments        - List adjustments
POST   /api/v1/inventory/adjustments/sync   - Sync to Zoho
```

#### Labels
```
GET    /api/v1/labels/orders               - List orders
POST   /api/v1/labels/generate             - Generate labels
GET    /api/v1/labels/history              - Print history
```

#### Sales Imports
```
GET    /api/v1/sales-imports               - List imports
POST   /api/v1/sales-imports/upload        - Upload CSV
DELETE /api/v1/sales-imports/:id           - Delete import
```

---

## 🔐 Security

### Authentication Flow
1. User logs in with username/password
2. Backend validates credentials
3. JWT token issued with expiration
4. Token stored in localStorage
5. Token sent with all API requests
6. Backend validates token on each request

### Security Features
- ✅ JWT-based authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ Input validation (Pydantic)
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ XSS prevention
- ✅ CSRF protection
- ✅ Secure environment variables
- ✅ HTTPS enforced in production

### Best Practices
- Never commit `.env` files
- Rotate secrets regularly
- Use strong passwords
- Enable 2FA where possible
- Monitor access logs
- Keep dependencies updated

---

## 📄 License

This project is proprietary software for RM365 internal use only. All rights reserved.

---

**Built with ❤️ for RM365 team productivity**