# mesa de ayuda 

## stack tecnologico 

|Paquete|Proposito|
|-------|---------|
|express|Framework web minimalistapara crear APIs REST|
|  zod  | Validacion de datos con tipado fuerte,ideal para esquemas en TS|
| Pino   | Logger rapiod y eficiente paraproduccion | 
| pino-pretty| Formatear los logs de Pino para entornos de desarrollo |
| jsonwebtoken  | Generacion y verificacion de tokens jwt para autenticacion|
| bcryptjs | Encriptacion de contraseñas con hashing seguro | 
| class-validator | validacion declarativa de clases usando decoradores| 
| class-tansform | transformacion de objetosentre calses y planos (DTOs) |
| refelct-metadata | soporte para metadatos en decoradores (requerido para class-validator)| 
| cors | middleware para habilitar CORs (Cross origin resourse sharing) en express |
| dotenv | cargar variables de entorno desde el archivo .env |
| morgan | Middleware para logging de peticiones HTTP |
| @prisma/client | cliente de prisma para interactuar con la base de datos | 
| tsx | Ejecuta archivos TS con soporte para ESM y hot-reload | 
| ts-node | ejecuta archivos .ts directamente sin transpilar | 
| nodemon | Reiniciar automaticamente el servidor al detectar cambios | 
| prisma | ORM para modelar y migragar la base de datos | 
| Vitest | Framework de testing rapido y compatible con Vite | 
| Superteste | Permite testear endpoints HTTP de express |
| eslint | A nalizar el codigo para  detectar errores y malas practicas de codigo | 
| @typescript-eslint/ parser | permite que ESLint entienda TypeScript | 
| @typescript-eslint/ eslint-plugin | Reglas especificas para TypeScript | 
| eslint-config-prettier | Desactivar reglas que interfieren con Prettier |
| prettier | Formateador de codigo consistente |
| husky | Ejecuta scripts en hook de Git (ej. antes de hacer commit) |
| lint-staged | Aplica linters solo a archivos modificados en el commit | 
| @types/... | Proveen tipados TS a paquetes instalados | 



## comandos de arranque 

1. inicializar el proyecto NodeJS

npm init - y 

2. instalacion e instalacion de ts


    npm i -d typescript

    npx tsc --init

    

3. instalar dependencias runtime


    npm i express zod pino pino-pretty jsonwebtoken bcryptjs class-validator class-transform reflect-metadata cors dotenv morgan @prisma/client

4. Instalacion de dependencias de desarrollo 


npm i -D tsx ts-node nodemon 

npm i -D @types/node @types/express @types/jsonwebtoken @types/cors @types/morgan

npm i -D prisma vitest supertest @types/supertest 

npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier

npm i -D prettier husky lint-staged

5. Inicializar prisma 

npx prisma init 