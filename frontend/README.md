# RM365 Toolbox - Frontend

Modern, vanilla JavaScript single-page application (SPA) for the RM365 Toolbox platform.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
- [Development Guide](#development-guide)

## Overview

The frontend is a **vanilla JavaScript** application with no framework dependencies.

### Key Features

- Pure JavaScript (ES6+) - No React, Vue, or Angular
- Modern UI with dark mode support
- Responsive mobile-first design
- JWT authentication with role-based access
- Fast and lightweight
- Progressive Web App (PWA) capabilities
- Real-time data updates
- Rich data visualizations

### Technology Stack

- **JavaScript (ES6+)**: Modules, async/await, classes
- **HTML5**: Semantic markup, accessibility
- **CSS3**: Grid, Flexbox, custom properties
- **Chart.js**: Data visualization
- **Day.js**: Date manipulation
- **DOMPurify**: XSS sanitization

---

## Architecture

### Single-Page Application

The application uses a custom router to load pages dynamically without full reloads.

### Module Pattern

Each feature module follows a consistent structure:

```
module-name/
 index.html           # Page template
 module-name.js       # Module logic
 components/          # Reusable components
```

---

## Getting Started

### Prerequisites

- Python 3.7+ or Node.js (for local server)
- Modern web browser
- Backend API running

### Local Development

1. **Start a local server**

```bash
cd frontend
python -m http.server 3000
```

2. **Open in browser**
```
http://localhost:3000
```

3. **Configure API endpoint**

Edit `js/config.js`:
```javascript
export const config = {
  API: 'http://localhost:8000',
  DEBUG: true,
};
```

4. **Enable debug mode**
```
http://localhost:3000/?debug=true
```

---

## Project Structure

```
frontend/
 index.html                # Main app shell
 manifest.webmanifest      # PWA manifest
 components/               # Shared components
 css/                      # Global styles
 html/                     # Page templates
    attendance/
    enrollment/
    inventory/
    labels/
    sales-imports/
    usermanagement/
 js/                       # JavaScript modules
    modules/             # Feature modules
    services/            # API services
    ui/                  # UI utilities
    utils/               # Utilities
 assets/                   # Static assets
```

---

## Core Concepts

### 1. Router

Handles navigation without page reloads.

```html
<a href="/attendance" data-link>Attendance</a>
```

### 2. Authentication

JWT-based with automatic token refresh.

```javascript
import { AuthService } from './services/auth-service.js';
const authService = new AuthService();
await authService.login(username, password);
```

### 3. API Integration

Centralized API client.

```javascript
import { api } from './services/api.js';
const users = await api.get('/api/v1/users');
```

### 4. Error Handling

Consistent error handling.

```javascript
import { showToast } from './ui/toast.js';
try {
  await api.post('/api/v1/users', data);
  showToast('Success', 'success');
} catch (error) {
  showToast('Error', 'error');
}
```

---

## Development Guide

### Adding a New Page

1. Create HTML file in `html/module/page.html`
2. Create JavaScript module in `js/modules/module/page.js`
3. Add route in `js/router.js`
4. Add navigation link in `components/universal-sidebar.html`

### Creating a Modal

```javascript
import { createModal, openModal } from './ui/modal.js';

const modal = createModal({
  title: 'Confirm',
  content: '<p>Are you sure?</p>',
  actions: [
    { label: 'Cancel', variant: 'secondary' },
    { label: 'Confirm', variant: 'primary', onClick: handleConfirm },
  ],
});

openModal(modal.id);
```

### Showing Notifications

```javascript
import { showToast } from './ui/toast.js';

showToast('Message', 'success');  // Green
showToast('Message', 'error');    // Red
showToast('Message', 'warning');  // Yellow
showToast('Message', 'info');     // Blue
```

### Working with Tables

```javascript
import { createTable } from './ui/table-utils.js';

const table = createTable({
  columns: [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
  ],
  data: items,
  searchable: true,
  pagination: true,
});
```

### Creating Charts

```javascript
import { createChart } from './ui/charts.js';

const chart = createChart({
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed'],
    datasets: [{ label: 'Data', data: [12, 19, 3] }],
  },
});
```

---

## Best Practices

### Code Organization
- Keep files small and focused
- Use modules for reusability
- Follow naming conventions
- Document complex logic

### Performance
- Minimize DOM manipulations
- Use event delegation
- Lazy load modules
- Optimize images

### Accessibility
- Use semantic HTML
- Add ARIA labels
- Support keyboard navigation
- Ensure color contrast

### Security
- Sanitize user input
- Validate all data
- Use HTTPS
- Don't store sensitive data in localStorage

---

**Built with vanilla JavaScript for maximum performance and simplicity**