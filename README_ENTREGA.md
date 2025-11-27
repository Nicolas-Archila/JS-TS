# Hospital Desk Help - Entrega Segundo Corte

**Proyecto Integrador - Sistema de Gestión de Tickets**  
## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Documentación Entregable](#documentación-entregable)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Modelo de Datos](#modelo-de-datos)
5. [Endpoints Implementados](#endpoints-implementados)
6. [Instrucciones de Instalación](#instrucciones-de-instalación)
7. [Pruebas](#pruebas)
8. [Patrones de Diseño](#patrones-de-diseño)
9. [Estado del Proyecto](#estado-del-proyecto)

---

## 🎯 Resumen Ejecutivo

El **Hospital Desk Help** es un sistema backend de gestión de tickets de soporte técnico diseñado para hospitales, implementado con **TypeScript**, **Node.js**, **Express**, **Prisma** y **PostgreSQL**.

El proyecto aplica principios de **Clean Architecture** y **Domain-Driven Design (DDD)**, separando claramente las capas de dominio, aplicación, infraestructura e interfaces. Se han implementado **17 patrones de diseño** documentados, y se ha garantizado la trazabilidad, seguridad y escalabilidad del sistema.

### Tecnologías Principales

- **Runtime:** Node.js 20+ con TypeScript 5
- **Framework Web:** Express.js
- **ORM:** Prisma ORM
- **Base de Datos:** PostgreSQL 16
- **Validación:** Zod
- **Testing:** Vitest
- **Logging:** Pino
- **Contenedores:** Docker + Docker Compose

---

## 📚 Documentación Entregable

Todos los documentos requeridos para la evaluación del segundo corte se encuentran en la raíz del proyecto:

| Documento | Ubicación | Descripción |
|-----------|-----------|-------------|
| **Catálogo de Patrones** | `PATRONES.md` | Detalle de 17 patrones de diseño aplicados |
| **Script DDL** | `database/DDL.sql` | Definición completa del schema de base de datos |
| **Diccionario de Datos** | `DICCIONARIO_DATOS.md` | Descripción exhaustiva de tablas, columnas y relaciones |
| **README Principal** | `README.md` | Documentación técnica completa con comandos |
| **Este Documento** | `README_ENTREGA.md` | Resumen ejecutivo para la entrega |

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue los principios de **Clean Architecture**, organizando el código en capas concéntricas con dependencias unidireccionales hacia el dominio:

```
src/
├── domain/               # Capa de Dominio (núcleo)
│   ├── entities/        # Entidades: User, Ticket, Area
│   ├── events/          # Domain Events
│   ├── services/        # Servicios de dominio (State Machine)
│   └── value-objects/   # Value Objects: TicketId, Email, Status
│
├── application/         # Capa de Aplicación
│   ├── dtos/           # Data Transfer Objects (validación con Zod)
│   ├── ports/          # Interfaces (Repository, EventBus, Clock)
│   └── use-cases/      # Casos de Uso (CreateTicket, ListTickets, etc.)
│
├── infrastructure/      # Capa de Infraestructura
│   ├── db/             # Prisma Client
│   ├── events/         # Implementación de EventBus
│   ├── repositories/   # Implementación de Repositories (Prisma)
│   └── security/       # Hashing, PASETO, RBAC
│
├── interfaces/          # Capa de Presentación
│   ├── http/
│   │   ├── controllers/  # Controllers HTTP
│   │   ├── routes/       # Definición de rutas
│   │   ├── middlewares/  # Auth, RBAC, Validation, Error Handling
│   │   └── base/         # Clases base reutilizables
│   └── mappers/          # Transformación Entidad → DTO HTTP
│
├── modules/             # Módulos verticales (Ticket, Auth)
├── config/              # Configuración (env, logger, server)
└── main.ts              # Punto de entrada
```

### Principios Aplicados

- ✅ **Separation of Concerns:** Cada capa tiene responsabilidades claras
- ✅ **Dependency Inversion:** Las capas externas dependen de abstracciones internas
- ✅ **Single Responsibility:** Cada clase/módulo tiene una única razón de cambio
- ✅ **Open/Closed:** Abierto a extensión, cerrado a modificación

---

## 🗄️ Modelo de Datos

### Diagrama Entidad-Relación

```
┌─────────────────┐
│     User        │
├─────────────────┤
│ id (PK) UUID    │
│ name            │
│ email (UNIQUE)  │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│    Ticket       │  N:1  │     Area        │
├─────────────────┤◄──────├─────────────────┤
│ id (PK) UUID    │       │ id (PK) UUID    │
│ title           │       │ name            │
│ status          │       └─────────────────┘
│ priority        │
│ createdAt       │
│ userId (FK)     │
│ areaId (FK)     │
└─────────────────┘
```

### Tablas Implementadas

| Tabla | Registros Esperados | Propósito |
|-------|---------------------|-----------|
| **User** | ~100-1000 | Usuarios del sistema (personal hospitalario) |
| **Area** | ~10-50 | Áreas o departamentos del hospital |
| **Ticket** | ~10,000+ | Tickets de soporte técnico |

**Documentación completa:** Ver `DICCIONARIO_DATOS.md`

---

## 🔌 Endpoints Implementados

### Módulo: Tickets

| Método | Ruta | Descripción | Autenticación | Permisos |
|--------|------|-------------|---------------|----------|
| `POST` | `/api/tickets` | Crear nuevo ticket | ✅ Requerida | `ticket:create` |
| `GET` | `/api/tickets` | Listar tickets (paginado, filtros) | ✅ Requerida | `ticket:list` |
| `GET` | `/api/tickets/:id` | Obtener ticket por ID | ✅ Requerida | `ticket:list` |
| `PATCH` | `/api/tickets/:id/state` | Cambiar estado del ticket | ✅ Requerida | `ticket:transition` |

#### Ejemplo: Crear Ticket

**Request:**
```http
POST /api/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "PC de triage no enciende",
  "priority": "HIGH",
  "userId": "5a8d0f70-6b3b-4f6f-9b93-3b2b2e2f0002",
  "areaId": "6b1a9c80-1234-4567-8901-abcdefabcdef"
}
```

**Response:** `201 Created`
```json
{
  "id": "cb14f44f-d80a-4de1-a112-e3f1d8097bed",
  "title": "PC de triage no enciende",
  "status": "OPEN",
  "priority": "HIGH",
  "userId": "5a8d0f70-6b3b-4f6f-9b93-3b2b2e2f0002",
  "areaId": "6b1a9c80-1234-4567-8901-abcdefabcdef",
  "createdAt": "2025-11-18T10:30:00.000Z"
}
```

#### Ejemplo: Listar Tickets con Filtros

**Request:**
```http
GET /api/tickets?status=OPEN&priority=HIGH&limit=10&offset=0
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "total": 42,
  "offset": 0,
  "limit": 10,
  "items": [
    {
      "id": "...",
      "title": "...",
      "status": "OPEN",
      "priority": "HIGH",
      ...
    }
  ]
}
```

---

### Módulo: Autenticación

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario | ❌ Público |
| `POST` | `/api/auth/login` | Iniciar sesión | ❌ Público |

#### Ejemplo: Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice.admin@hospital.edu",
  "password": "admin123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "v4.public.eyJzdWIiOiI1YThkMGY3MC02YjNi...",
  "token_type": "Bearer",
  "expires_in": 7200
}
```

---

## 🚀 Instrucciones de Instalación

### Prerrequisitos

- Node.js 20+
- Docker y Docker Compose
- PostgreSQL 16 (o usar contenedor)

### Instalación Paso a Paso

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd hospital-desk
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Levantar base de datos con Docker:**
   ```bash
   docker-compose up -d
   ```

5. **Generar cliente Prisma:**
   ```bash
   npm run prisma:generate
   ```

6. **Ejecutar migraciones:**
   ```bash
   npm run prisma:migrate
   ```

7. **Insertar datos semilla (opcional):**
   ```bash
   npm run prisma:seed
   ```

8. **Generar claves PASETO:**
   ```bash
   npm run keys:dev
   ```

9. **Iniciar servidor en modo desarrollo:**
   ```bash
   npm run start:dev
   ```

El servidor estará disponible en `http://localhost:8000`

---

## 🧪 Pruebas

### Pruebas Unitarias

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Pruebas de Endpoints

Se incluyen archivos `.rest` en la carpeta `rest/` para probar endpoints con Thunder Client o extensiones similares:

- `rest/Auth.rest` - Registro y login
- `rest/Tickets_GET.rest` - Consultas de tickets
- `rest/Tickets_POST.rest` - Creación de tickets
- `rest/Tickets_PATCH.rest` - Actualización de estado

---

## 🎨 Patrones de Diseño

Se han aplicado **17 patrones de diseño** documentados en `PATRONES.md`:

### Resumen por Categoría

| Categoría | Patrones | Cantidad |
|-----------|----------|----------|
| **Arquitectónicos** | Clean Architecture | 1 |
| **Creacionales** | Factory Method, Singleton | 2 |
| **Estructurales** | Repository, Adapter, Mapper | 3 |
| **Comportamiento** | Strategy, State Machine, Observer, Command | 4 |
| **Seguridad** | Middleware Chain, RBAC | 2 |
| **Otros** | Module Pattern, Value Object, Test Doubles, Environment Config | 5 |

**Ver detalles completos en:** `PATRONES.md`

---

## 📊 Estado del Proyecto

### ✅ Implementado (Segundo Corte)

- [x] Arquitectura limpia con separación de capas
- [x] Modelo de datos con 3 tablas principales
- [x] CRUD completo de Tickets
- [x] Autenticación con PASETO
- [x] Autorización con RBAC
- [x] Validación con Zod
- [x] Event Bus para eventos de dominio
- [x] Logging con Pino
- [x] Paginación y filtros
- [x] Máquina de estados para tickets
- [x] Tests unitarios básicos
- [x] Docker Compose para desarrollo
- [x] Documentación completa

### 🔄 En Desarrollo (Próximo Corte)

- [ ] Tests E2E completos
- [ ] CI/CD con GitHub Actions
- [ ] Swagger/OpenAPI
- [ ] Rate limiting
- [ ] Auditoría y logs de dominio
- [ ] Métricas y observabilidad
- [ ] Módulos adicionales (Areas, Users CRUD)

---

## 📦 Estructura de Archivos Importantes

```
hospital-desk/
├── PATRONES.md                 # ✅ Catálogo de patrones
├── DICCIONARIO_DATOS.md        # ✅ Diccionario de datos
├── README_ENTREGA.md           # ✅ Este documento
├── database/
│   └── DDL.sql                 # ✅ Script SQL
├── prisma/
│   └── schema.prisma           # ✅ Schema de Prisma
├── rest/                       # Archivos de prueba HTTP
├── src/                        # Código fuente
├── tests/                      # Tests unitarios
├── docker-compose.yml          # Configuración Docker
└── package.json                # Dependencias
```
