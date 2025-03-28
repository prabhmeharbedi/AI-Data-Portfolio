# Generative AI & ML Portfolio

A modern portfolio website showcasing Generative AI and Machine Learning projects.

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The development server will be available at http://localhost:3000.

## Deployment to Render

This application is configured for deployment on Render. Follow these steps:

1. **Commit all changes to your repository**

2. **Create a new Render Web Service**
   - Connect your GitHub/GitLab repository
   - Choose "Web Service"
   - Select the appropriate branch

3. **Configure the Web Service**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node

4. **Set Environment Variables**
   - Make sure to set all required environment variables in the Render dashboard
   - Required variables are listed in `.env.example`

5. **Advanced Settings**
   - Health Check Path: `/api/health` (create this endpoint if needed)
   - Instance Type: Recommended minimum 512 MB RAM

## Troubleshooting Deployment

If you encounter issues with deployment, check the following:

1. **Database Connection**
   - Ensure your DATABASE_URL is correctly set in Render's environment variables
   - Check database permissions and connectivity

2. **Port Binding**
   - The application is configured to use the PORT environment variable provided by Render
   - No manual port configuration should be necessary

3. **Memory Usage**
   - If the application crashes, consider upgrading to a plan with more RAM

4. **File Permissions**
   - Ensure that the application has the necessary permissions to write to any required directories

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Express
- Database: PostgreSQL with Drizzle ORM
- AI Integration: OpenAI API

## License

MIT 