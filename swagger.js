import swaggerJSDoc from 'swagger-jsdoc';


const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: '포지큐브 백엔드 과제',
      version: '1.0.0',
      description: '',
    },
    host: 'localhost:4000',
    basePath: '/'
  },
  apis: ['./app.js'],
};

export const specs = swaggerJSDoc(options);