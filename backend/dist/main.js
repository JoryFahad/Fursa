"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const jwt_middleware_1 = require("./auth/jwt.middleware");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.use((req, res, next) => {
        console.log('[GLOBAL] Incoming:', req.method, req.url, req.headers.authorization);
        next();
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Fursa - Internship Platform API')
        .setDescription(`🚀 **Fursa Internship Platform API**

A comprehensive RESTful API for managing internship opportunities, connecting students and companies.

## 🌟 Features
- **Student Management**: Profile creation, internship applications, file uploads
- **Company Management**: Internship posting, applicant review, status management  
- **Authentication**: JWT-based auth with role-based access control
- **File Handling**: Resume/cover letter upload and download via MinIO/S3
- **Email Validation**: MX record verification and disposable email detection

## 🔐 Authentication
Most endpoints require JWT authentication. Use the **Authorize** button below to set your Bearer token.

### How to get started:
1. **Register**: \`POST /auth/register\` - Create a new account
2. **Login**: \`POST /auth/login\` - Get your JWT token  
3. **Authorize**: Click the lock icon and enter: \`Bearer YOUR_JWT_TOKEN\`
4. **Explore**: Try out the endpoints based on your role

## 👥 User Roles
- **Student**: Apply to internships, manage applications
- **Company**: Post internships, manage applicants
- **Admin**: Full system access

## 📁 File Operations
- Upload files using \`multipart/form-data\`
- Download files using query parameters (\`?type=resume\` or \`?type=cover-letter\`)

## 🔗 Base URL
- **Development**: \`http://localhost:3000\`
- **Production**: \`https://api.fursa.com\`

---
*Built with ❤️ using NestJS, Prisma, and PostgreSQL*`)
        .setVersion('2.0.0')
        .setContact('Fursa Development Team', 'https://code.is.sa/internal/interns/2025/intern-hub/fursa/api', 'hatim.alshehri@innosoft.sa')
        .setLicense('Proprietary', 'All rights reserved - Innosoft')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Authentication', 'User registration, login, and token management')
        .addTag('Student Profile', 'Student profile management endpoints')
        .addTag('Company Profile', 'Company profile management endpoints')
        .addTag('Internships', 'Internship posting and management')
        .addTag('Applications', 'Internship application management')
        .addTag('Student Applications', 'Student-specific application endpoints')
        .addTag('Company Applications', 'Company-specific application endpoints')
        .addTag('File Management', 'File upload and download operations')
        .addServer('http://localhost:3000', 'Development server')
        .addServer('https://api.fursa.com', 'Production server')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.use((req, res, next) => {
        const publicRoutes = ['/auth/login', '/auth/register', '/auth/refresh'];
        if (publicRoutes.includes(req.path)) {
            return next();
        }
        return new jwt_middleware_1.JwtDecodeMiddleware().use(req, res, next);
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map