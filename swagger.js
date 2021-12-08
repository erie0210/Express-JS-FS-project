import swaggerJSDoc from 'swagger-jsdoc';


const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: '백엔드 swagger',
      version: '1.0.0',
      description: '',
    },
    host: 'localhost:4000',
    basePath: '/'
  },
  apis: ['./app.js'],
};

export const specs = swaggerJSDoc(options);
