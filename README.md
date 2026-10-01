# Flask Web Application Demo

A clean, responsive Flask web application with a modern UI including a landing page and contact form. Built as a demonstration of Flask best practices for web development.

## Features

- **Responsive Landing Page** - Hero section, features showcase, and call-to-action
- **Contact Form** - Server-side and client-side validation with flash messages
- **Modern UI** - Bootstrap 5 with custom styling and smooth animations
- **Flask Best Practices** - Clean code structure, template inheritance, proper error handling

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/web-app-deploy-demo.git
   cd web-app-deploy-demo
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open in browser**
   Navigate to `http://localhost:5000`

### Docker Usage

1. **Build and start with Docker Compose**
   ```bash
   docker compose up -d --build
   ```

2. **Open in browser**
   Navigate to `http://localhost:5000`

3. **Stop the application**
   ```bash
   docker compose down
   ```

### VPS Deployment

#### Prerequisites
- Ubuntu 22.04+ server
- Docker and Docker Compose installed
- Domain name pointing to server IP (optional, for SSL)

#### Deployment Steps

1. **Clone the repository on your VPS**
   ```bash
   git clone https://github.com/yourusername/web-app-deploy-demo.git
   cd web-app-deploy-demo
   ```

2. **Configure environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

4. **Set up reverse proxy (Nginx)** - Example configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

5. **Enable SSL with Let's Encrypt** (recommended)
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

## Project Structure

```
web-app-deploy-demo/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── docker-compose.yml     # Docker Compose for development
├── docker-compose.prod.yml # Docker Compose for production
├── Dockerfile             # Docker image definition
├── .env.example           # Environment variables template
├── templates/
│   ├── base.html          # Base template with layout
│   ├── index.html         # Landing page
│   └── contact.html       # Contact form page
└── static/
    ├── css/
    │   └── style.css      # Custom styles
    └── js/
        └── main.js        # Client-side JavaScript
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Flask environment (development/production) | `development` |
| `SECRET_KEY` | Secret key for session management | `dev-secret-key-change-in-production` |
| `PORT` | Port to run the application on | `5000` |

Create a `.env` file from `.env.example` and customize for your environment.

## Technology Stack

- **Backend**: Flask 3.0
- **Frontend**: Bootstrap 5.3, Vanilla JavaScript
- **Containerization**: Docker, Docker Compose
- **Deployment**: Nginx reverse proxy, systemd (optional)

## License

MIT License - feel free to use this as a starting point for your own projects.