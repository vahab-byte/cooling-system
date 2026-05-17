import swaggerJsdoc from 'swagger-jsdoc';

const servers = [
  {
    url: 'http://localhost:3001/api/v1',
    description: 'Development Server',
  },
];

// Add production server if available
if (process.env.NODE_ENV === 'production' || process.env.RENDER_EXTERNAL_URL) {
  const prodUrl = process.env.RENDER_EXTERNAL_URL 
    ? `${process.env.RENDER_EXTERNAL_URL}/api/v1`
    : 'https://arcticfresh-backend.onrender.com/api/v1';
  servers.unshift({
    url: prodUrl,
    description: 'Production Server (Render)',
  });
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ArcticFresh AC Service Station API',
      version: '2.0.0',
      description: 'API documentation for the ArcticFresh AC Service Station platform.',
    },
    servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const specs = swaggerJsdoc(options);
