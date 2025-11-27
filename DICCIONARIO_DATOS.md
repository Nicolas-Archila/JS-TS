# Diccionario de Datos

## Hospital Desk Help - Sistema de Gestión de Tickets

**Versión:** 1.0.0  
**Fecha:** Noviembre 2025  
**Base de Datos:** PostgreSQL 16+

---

## Índice de Tablas

1. [User](#tabla-user)
2. [Area](#tabla-area)
3. [Ticket](#tabla-ticket)
4. [Vistas](#vistas)
5. [Relaciones](#diagrama-de-relaciones)
6. [Dominios de Valores](#dominios-de-valores)

---

## Tabla: User

**Nombre de tabla:** `User`  
**Descripción:** Almacena la información de los usuarios del sistema que pueden reportar y gestionar tickets de soporte técnico.

### Columnas

| Columna | Tipo | Restricciones | Descripción | Ejemplo |
|---------|------|---------------|-------------|---------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del usuario generado automáticamente | `5a8d0f70-6b3b-4f6f-9b93-3b2b2e2f0001` |
| `name` | VARCHAR(255) | NOT NULL | Nombre completo del usuario | `"Alice Admin"` |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE, CHECK (formato email) | Correo electrónico único del usuario | `"alice.admin@hospital.edu"` |

### Índices

| Nombre del Índice | Columnas | Tipo | Propósito |
|-------------------|----------|------|-----------|
| `User_pkey` | `id` | PRIMARY KEY | Clave primaria |
| `User_email_key` | `email` | UNIQUE | Garantizar unicidad del email |
| `idx_user_email` | `email` | BTREE | Optimizar búsquedas por email |

### Restricciones

- **PK:** `id` - Clave primaria UUID
- **UNIQUE:** `email` - No puede haber dos usuarios con el mismo email
- **CHECK:** `email_format_check` - Valida formato correcto de email

### Relaciones

- **1:N** con `Ticket` (un usuario puede tener múltiples tickets)

---

## Tabla: Area

**Nombre de tabla:** `Area`  
**Descripción:** Define las áreas o departamentos del hospital donde se pueden reportar problemas técnicos.

### Columnas

| Columna | Tipo | Restricciones | Descripción | Ejemplo |
|---------|------|---------------|-------------|---------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del área | `6b1a9c80-1234-4567-8901-abcdefabcdef` |
| `name` | VARCHAR(255) | NOT NULL, CHECK (longitud > 0) | Nombre del área o departamento | `"Urgencias"`, `"Laboratorio Clínico"` |

### Índices

| Nombre del Índice | Columnas | Tipo | Propósito |
|-------------------|----------|------|-----------|
| `Area_pkey` | `id` | PRIMARY KEY | Clave primaria |
| `idx_area_name` | `name` | BTREE | Optimizar búsquedas por nombre de área |

### Restricciones

- **PK:** `id` - Clave primaria UUID
- **CHECK:** `area_name_not_empty` - El nombre no puede estar vacío o solo espacios

### Relaciones

- **1:N** con `Ticket` (un área puede tener múltiples tickets)

---

## Tabla: Ticket

**Nombre de tabla:** `Ticket`  
**Descripción:** Almacena los tickets de soporte técnico reportados por usuarios en diferentes áreas del hospital.

### Columnas

| Columna | Tipo | Restricciones | Descripción | Ejemplo | Valores Permitidos |
|---------|------|---------------|-------------|---------|-------------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del ticket | `cb14f44f-d80a-4de1-a112-e3f1d8097bed` | - |
| `title` | VARCHAR(500) | NOT NULL, CHECK (longitud >= 3) | Título descriptivo del problema | `"PC de triage no enciende"` | Mínimo 3 caracteres |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'OPEN', CHECK (enum) | Estado actual del ticket | `"OPEN"` | `OPEN`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `CANCELLED` |
| `priority` | VARCHAR(20) | NOT NULL, CHECK (enum) | Nivel de prioridad del ticket | `"HIGH"` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `createdAt` | TIMESTAMP(3) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Fecha y hora de creación | `2025-11-18 10:30:00.000` | - |
| `userId` | UUID | NOT NULL, FK → User(id) | Referencia al usuario que reportó | `5a8d0f70-6b3b-4f6f-9b93-3b2b2e2f0002` | - |
| `areaId` | UUID | NOT NULL, FK → Area(id) | Referencia al área donde ocurrió | `6b1a9c80-1234-4567-8901-abcdefabcdef` | - |

### Índices

| Nombre del Índice | Columnas | Tipo | Propósito |
|-------------------|----------|------|-----------|
| `Ticket_pkey` | `id` | PRIMARY KEY | Clave primaria |
| `idx_ticket_status` | `status` | BTREE | Filtrar por estado |
| `idx_ticket_priority` | `priority` | BTREE | Filtrar por prioridad |
| `idx_ticket_user_id` | `userId` | BTREE | Filtrar por usuario |
| `idx_ticket_area_id` | `areaId` | BTREE | Filtrar por área |
| `idx_ticket_created_at` | `createdAt DESC` | BTREE | Ordenar por fecha (más recientes primero) |
| `idx_ticket_status_priority` | `status, priority` | BTREE COMPUESTO | Consultas que filtran por estado y prioridad |
| `idx_ticket_area_status` | `areaId, status` | BTREE COMPUESTO | Reportes por área y estado |
| `idx_ticket_user_status` | `userId, status` | BTREE COMPUESTO | Ver tickets de usuario por estado |

### Restricciones

- **PK:** `id` - Clave primaria UUID
- **FK:** `userId` → `User(id)` - Restricción de integridad referencial (ON DELETE RESTRICT, ON UPDATE CASCADE)
- **FK:** `areaId` → `Area(id)` - Restricción de integridad referencial (ON DELETE RESTRICT, ON UPDATE CASCADE)
- **CHECK:** `ticket_title_not_empty` - El título debe tener al menos 3 caracteres
- **CHECK:** `ticket_status_valid` - Estado debe ser uno de los valores permitidos
- **CHECK:** `ticket_priority_valid` - Prioridad debe ser uno de los valores permitidos

### Relaciones

- **N:1** con `User` - Muchos tickets pertenecen a un usuario
- **N:1** con `Area` - Muchos tickets pertenecen a un área

### Triggers

- **trigger_validate_ticket_status:** Valida que las transiciones de estado sean permitidas según la máquina de estados del dominio

---

## Vistas

### v_tickets_full

**Descripción:** Vista desnormalizada que muestra información completa de tickets incluyendo datos del usuario y área.

**Columnas:**
- `id` - ID del ticket
- `title` - Título del ticket
- `status` - Estado actual
- `priority` - Prioridad
- `createdAt` - Fecha de creación
- `user_name` - Nombre del usuario
- `user_email` - Email del usuario
- `area_name` - Nombre del área

**Uso:** Consultas de reporte y listado de tickets con información contextual.

---

### v_tickets_by_area

**Descripción:** Resumen estadístico de tickets agrupados por área.

**Columnas:**
- `area_id` - ID del área
- `area_name` - Nombre del área
- `total_tickets` - Total de tickets en el área
- `open_tickets` - Tickets abiertos
- `assigned_tickets` - Tickets asignados
- `in_progress_tickets` - Tickets en progreso
- `resolved_tickets` - Tickets resueltos
- `closed_tickets` - Tickets cerrados
- `cancelled_tickets` - Tickets cancelados

**Uso:** Dashboard de supervisión por áreas.

---

### v_tickets_by_user

**Descripción:** Resumen de tickets agrupados por usuario.

**Columnas:**
- `user_id` - ID del usuario
- `user_name` - Nombre del usuario
- `user_email` - Email del usuario
- `total_tickets` - Total de tickets del usuario
- `active_tickets` - Tickets activos (OPEN, ASSIGNED, IN_PROGRESS)
- `completed_tickets` - Tickets completados (RESOLVED, CLOSED)

**Uso:** Seguimiento de actividad por usuario.

---

## Diagrama de Relaciones

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

---

## Dominios de Valores

### Status (Estado del Ticket)

Máquina de estados que define las transiciones válidas:

| Estado | Descripción | Transiciones Permitidas |
|--------|-------------|------------------------|
| `OPEN` | Ticket recién creado, sin asignar | → `ASSIGNED`, `CANCELLED` |
| `ASSIGNED` | Ticket asignado a un técnico | → `IN_PROGRESS`, `CANCELLED` |
| `IN_PROGRESS` | Técnico trabajando en el problema | → `RESOLVED`, `CANCELLED` |
| `RESOLVED` | Problema solucionado, pendiente de cierre | → `CLOSED` |
| `CLOSED` | Ticket completamente cerrado | (estado final) |
| `CANCELLED` | Ticket cancelado por alguna razón | (estado final) |

**Regla de Negocio:** Las transiciones están protegidas por un trigger que valida la máquina de estados.

---

### Priority (Prioridad del Ticket)

| Valor | Descripción | Tiempo de Respuesta Esperado |
|-------|-------------|----------------------------|
| `LOW` | Baja prioridad - no urgente | 72 horas |
| `MEDIUM` | Prioridad media - importante | 24 horas |
| `HIGH` | Alta prioridad - afecta operación | 4 horas |
| `URGENT` | Urgente - crítico para operación | 1 hora |

---

## Convenciones y Estándares

### Nomenclatura

- **Tablas:** PascalCase con prefijo según módulo (ej: `User`, `Area`, `Ticket`)
- **Columnas:** camelCase (ej: `userId`, `createdAt`)
- **Índices:** snake_case con prefijo `idx_` (ej: `idx_ticket_status`)
- **Foreign Keys:** snake_case con prefijo `fk_` (ej: `fk_ticket_user`)
- **Vistas:** snake_case con prefijo `v_` (ej: `v_tickets_full`)

### Tipos de Datos

- **IDs:** UUID v4 generados por `gen_random_uuid()`
- **Fechas:** TIMESTAMP(3) con zona horaria implícita
- **Strings:** VARCHAR con longitudes específicas
- **Enums:** Implementados como VARCHAR con restricciones CHECK

### Estrategia de Integridad Referencial

- **ON DELETE RESTRICT:** No permite eliminar registros padres con hijos asociados
- **ON UPDATE CASCADE:** Actualiza automáticamente las foreign keys si cambia la clave primaria (raro en UUID)

---

## Notas de Implementación

1. **Extensión pgcrypto:** Requerida para generación de UUIDs con `gen_random_uuid()`
2. **Índices Compuestos:** Diseñados para optimizar queries comunes de filtrado múltiple
3. **Triggers:** Implementan lógica de dominio crítica (validación de transiciones)
4. **Vistas:** Facilitan consultas complejas sin duplicar lógica en la aplicación
5. **Constraints:** Garantizan integridad de datos a nivel de base de datos

---

## Control de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | Nov 2025 | Schema inicial con tablas User, Area y Ticket |

---

**Mantenido por:** Equipo de Desarrollo Hospital Desk  
**Última actualización:** Noviembre 2025