# Generative AI & ML Portfolio

A modern portfolio website showcasing Generative AI and Machine Learning projects.

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with required variables (see `.env.example`)
4. Start the development server: `npm run dev`

The development server will be available at http://localhost:3000.

## Building for Production

This project uses a cross-platform build system that works on Windows, macOS, and Linux:

```bash
# Build the project
npm run build

# Start the production server
npm start
```

The build process:
1. Compiles client-side code using Vite
2. Bundles server-side code using esbuild
3. Creates the correct directory structure for production
4. Verifies the build output

## Deploying to Render

### Prerequisites

1. A [Render](https://render.com) account
2. Repository pushed to GitHub, GitLab, or Bitbucket
3. Required environment variables ready (see `.env.example`)

### Automatic Deployment (using render.yaml)

1. Fork/clone this repository to your own GitHub/GitLab/Bitbucket account
2. In the Render dashboard, go to "Blueprints" section
3. Click "New Blueprint Instance"
4. Connect your repository
5. Render will automatically deploy the service defined in `render.yaml`
6. Add your environment variables in the Render dashboard

### Manual Deployment

1. In the Render dashboard, click "New" and select "Web Service"
2. Connect your repository
3. Configure the service:
   - **Name**: Choose a name for your service
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build-render`
   - **Start Command**: `node start.js`
   - **Node Version**: 18.x or later

4. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `RENDER`: `true`
   - `PORT`: `10000` (Render will override this with its own port)
   - `DATABASE_URL`: Your database connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - Other variables as needed for email configuration

5. Click "Create Web Service"

### Troubleshooting Render Deployment

If you encounter issues during deployment, check:

1. **Build logs**: Look for errors in the build process
2. **Runtime logs**: Check for server startup errors
3. **Environment variables**: Verify all required variables are set correctly
4. **Path issues**: Ensure the build process is creating files in the expected locations

Common issues:
- If you see "Command not found" errors, check that dependencies are installed correctly
- If the server can't find files, verify the build paths in `start.js` and `render.yaml`
- For port binding issues, ensure you're using `process.env.PORT` in your server code

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Express
- Database: PostgreSQL with Drizzle ORM
- AI Integration: OpenAI API

## License

MIT 