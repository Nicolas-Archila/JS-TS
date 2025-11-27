# Catálogo de Patrones de Diseño Aplicados

## Hospital Desk Help - Sistema de Gestión de Tickets

---

## 1. Patrones Arquitectónicos

### 1.1 Clean Architecture (Arquitectura Limpia)
**Ubicación:** Estructura completa del proyecto

**Descripción:**  
La aplicación está organizada en capas bien definidas que separan las responsabilidades y dependencias:

```
src/
├── domain/          # Capa de Dominio (Entidades, Value Objects, Reglas de Negocio)
├── application/     # Capa de Aplicación (Casos de Uso, DTOs, Puertos)
├── infrastructure/  # Capa de Infraestructura (Implementaciones, BD, Seguridad)
└── interfaces/      # Capa de Presentación (HTTP, Controllers, Routes)
```

**Beneficios:**
- Independencia de frameworks
- Testabilidad mejorada
- Facilita el mantenimiento
- Permite cambiar implementaciones sin afectar la lógica de negocio

---

## 2. Patrones Creacionales

### 2.1 Factory Method
**Ubicación:** `src/domain/entities/Ticket.ts`, `src/domain/entities/User.ts`

**Implementación:**
```typescript
// Método estático para crear nuevas instancias
public static create(dto: CreateTicketInput, now: Date): Ticket {
    return new Ticket(
        TicketId.new(),
        dto.title,
        "OPEN",
        dto.priority,
        dto.userId,
        dto.areaId,
        dto.createdAt ?? now,
    );
}

// Método estático para rehidratar desde BD
public static rehydrate(row: RehydrateTicketDto): Ticket {
    return new Ticket(
        TicketId.from(row.id),
        row.title,
        row.status,
        row.priority,
        row.userId,
        row.areaId,
        new Date(row.createdAt),
    );
}
```

**Beneficios:**
- Encapsula la lógica de creación
- Constructor privado protege la instanciación directa
- Separa creación de nuevos objetos vs rehidratación desde BD

### 2.2 Singleton (Lazy)
**Ubicación:** `src/config/LazyContainer.ts`

**Implementación:**
```typescript
export class LazyContainer {
    private _paseto?: PasetoService;

    get paseto(): PasetoService {
        return (this._paseto ??= new PasetoService());
    }
}
```

**Beneficios:**
- Instancia única compartida
- Inicialización diferida (lazy loading)
- Gestión centralizada de dependencias

---

## 3. Patrones Estructurales

### 3.1 Repository Pattern
**Ubicación:** 
- Puerto: `src/application/ports/TicketRepository.ts`
- Implementación: `src/infrastructure/repositories/PrismaTicketRepository.ts`

**Implementación:**
```typescript
// Puerto (Interfaz)
export interface TicketRepository {
    save(ticket: Ticket): Promise<void>;
    findById(id: string): Promise<Ticket | null>;
    list(): Promise<Ticket[]>;
}

// Implementación con Prisma
export class PrismaTicketRepository implements TicketRepository {
    async save(ticket: Ticket): Promise<void> {
        await prismaClient.ticket.upsert({...});
    }
}
```

**Beneficios:**
- Abstrae el acceso a datos
- Permite cambiar el motor de BD sin afectar la lógica
- Facilita testing con repositorios en memoria

### 3.2 Adapter Pattern
**Ubicación:** `src/infrastructure/repositories/`

**Descripción:**  
Los repositorios actúan como adaptadores entre Prisma (tecnología específica) y las interfaces del dominio.

**Beneficios:**
- Desacoplamiento de la tecnología de persistencia
- Facilita la migración a otro ORM

### 3.3 Mapper Pattern
**Ubicación:** `src/interfaces/mappers/TicketMapper.ts`

**Implementación:**
```typescript
export const toHttp = (ticket: Ticket) => ({
    id: ticket.id.toString(),
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    userId: ticket.userId,
    areaId: ticket.areaId,
    createdAt: ticket.createdAt,
});
```

**Beneficios:**
- Transforma entidades de dominio a DTOs HTTP
- Protege el modelo interno
- Facilita versionado de API

---

## 4. Patrones de Comportamiento

### 4.1 Strategy Pattern
**Ubicación:** `src/application/ports/Clock.ts`

**Implementación:**
```typescript
export interface Clock {
    now(): Date;
}

export class SystemClock implements Clock {
    now(): Date {
        return new Date();
    }
}

export class LocalClock implements Clock {
    now(): Date {
        const utcNow = new Date();
        return new Date(utcNow.getTime() - 5 * 60 * 60 * 1000);
    }
}
```

**Beneficios:**
- Permite cambiar el origen del tiempo en runtime
- Facilita testing con tiempo controlado
- Útil para ajustes de zona horaria

### 4.2 State Machine Pattern
**Ubicación:** `src/domain/services/TicketStateMachine.ts`

**Implementación:**
```typescript
const ALLOWED: Record<TicketStatus, TicketStatus[]> = {
    OPEN: ["ASSIGNED", "CANCELLED"],
    ASSIGNED: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["RESOLVED", "CANCELLED"],
    RESOLVED: ["CLOSED"],
    CLOSED: [],
    CANCELLED: []
};

export const canTransition = (from: TicketStatus, to: TicketStatus): boolean => 
    ALLOWED[from].includes(to);
```

**Beneficios:**
- Define transiciones válidas de estado
- Previene estados inválidos
- Centraliza reglas de negocio

### 4.3 Observer Pattern (Event Bus)
**Ubicación:** 
- Puerto: `src/application/ports/EventBus.ts`
- Implementación: `src/infrastructure/events/InMemoryEventBus.ts`

**Implementación:**
```typescript
export interface EventBus {
    publishAll(events: DomainEvent[]): Promise<void>;
}

// En las entidades:
protected recordEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
}
```

**Beneficios:**
- Comunicación desacoplada entre módulos
- Facilita auditoría y trazabilidad
- Permite reaccionar a eventos del dominio

### 4.4 Command Pattern (Use Cases)
**Ubicación:** `src/application/use-cases/`

**Implementación:**
```typescript
export class CreateTicket {
    constructor(
        private readonly repo: TicketRepository,
        private readonly clock: Clock,
        private readonly bus: EventBus,
    ) {}

    async execute(input: CreateTicketInput): Promise<Ticket> {
        const ticket = Ticket.create(input, this.clock.now());
        await this.repo.save(ticket);
        await this.bus.publishAll(ticket.pullDomainEvents());
        return ticket;
    }
}
```

**Beneficios:**
- Encapsula operaciones de negocio
- Facilita testing unitario
- Reutilizable desde múltiples interfaces (HTTP, CLI, etc.)

---

## 5. Patrones de Validación

### 5.1 Schema Validation (Zod)
**Ubicación:** `src/application/dtos/`

**Implementación:**
```typescript
export const CreateTicketSchema = z.object({
    title: z.string().trim().min(3),
    priority: ZTicketPriority,
    userId: z.string(),
    areaId: z.string(),
    createdAt: z.date().optional(),
});
```

**Beneficios:**
- Validación declarativa y tipada
- Inferencia automática de tipos TypeScript
- Mensajes de error estructurados

---

## 6. Patrones de Seguridad

### 6.1 Middleware Chain
**Ubicación:** `src/interfaces/http/routes/TicketsRouter.ts`

**Implementación:**
```typescript
this.router.post("/",
    this.middleware.auth,
    this.middleware.rbac("ticket:create"),
    this.middleware.validate("body", CreateTicketSchema),
    this.middleware.wrap(this.controller.create),
);
```

**Beneficios:**
- Composición de validaciones
- Separación de concerns
- Orden de ejecución explícito

### 6.2 Role-Based Access Control (RBAC)
**Ubicación:** `src/infrastructure/security/RBAC.ts`

**Implementación:**
```typescript
const ACL: Record<Role, Action[]> = {
    ADMIN: ["ticket:create", "ticket:list", "ticket:transition"],
    USER: ["ticket:create", "ticket:list"]
};

export const can = (role: Role, action: Action): boolean => 
    ACL[role]?.includes(action) ?? false;
```

**Beneficios:**
- Control de acceso centralizado
- Fácil mantenimiento de permisos
- Auditable y trazable

---

## 7. Patrones de Módulos

### 7.1 Module Pattern (Vertical Slices)
**Ubicación:** `src/modules/TicketModule.ts`, `src/modules/AuthModule.ts`

**Implementación:**
```typescript
export class TicketModule extends BaseModule<TicketRepository> {
    public router(): Router {
        // Ensambla casos de uso, controlador, middleware y rutas
        const createTicket = new CreateTicket(this.repo, this.clock, this.bus);
        const controller = new TicketsController(createTicket, ...);
        
        const router = Router();
        router.use("/tickets", new TicketsRouter(controller, middleware).router);
        return router;
    }
}
```

**Beneficios:**
- Encapsula funcionalidad completa de un recurso
- Facilita escalabilidad horizontal
- Dependencias explícitas

---

## 8. Patrones de Value Objects

### 8.1 Value Object Pattern
**Ubicación:** 
- `src/domain/value-objects/TicketId.ts`
- `src/domain/value-objects/Email.ts`
- `src/domain/value-objects/Status.ts`

**Implementación:**
```typescript
export class TicketId {
    private constructor(private readonly value: string) {}

    static new(): TicketId {
        return new TicketId(randomUUID());
    }

    toString(): string {
        return this.value;
    }
}
```

**Beneficios:**
- Encapsula validación y lógica
- Previene errores por strings arbitrarios
- Mejora semántica del código

---

## 9. Patrones de Testing

### 9.1 Test Doubles (Fakes, Mocks)
**Ubicación:** `tests/unit/createTicket.test.ts`

**Implementación:**
```typescript
class InMemoryRepo {
    items: any[] = [];
    async save(ticket: unknown): Promise<void> {
        this.items.push(ticket);
    }
}

class FakeClock {
    now(): Date {
        return new Date("2025-01-01T00:00:00Z");
    }
}
```

**Beneficios:**
- Tests rápidos sin dependencias externas
- Control total sobre el comportamiento
- Facilita verificación de interacciones

---

## 10. Patrones de Configuración

### 10.1 Environment Configuration
**Ubicación:** `src/config/env.config.ts`, `src/config/ConfigServer.ts`

**Implementación:**
```typescript
const envSchema = z.object({
    PORT: z.coerce.number().default(3333),
    NODE_ENV: z.enum(["development", "test", "production"]),
    JWT_SECRET: z.string().min(8),
    // ...
});

export function loadEnv(): EnvVariables {
    return envSchema.parse(process.env);
}
```

**Beneficios:**
- Validación de variables de entorno al inicio
- Tipado fuerte
- Valores por defecto seguros

---

## Resumen de Patrones por Categoría

| Categoría | Patrones Aplicados | Cantidad |
|-----------|-------------------|----------|
| Arquitectónicos | Clean Architecture | 1 |
| Creacionales | Factory Method, Singleton | 2 |
| Estructurales | Repository, Adapter, Mapper | 3 |
| Comportamiento | Strategy, State Machine, Observer, Command | 4 |
| Validación | Schema Validation | 1 |
| Seguridad | Middleware Chain, RBAC | 2 |
| Módulos | Vertical Slice | 1 |
| Value Objects | Value Object Pattern | 1 |
| Testing | Test Doubles | 1 |
| Configuración | Environment Config | 1 |

**Total: 17 patrones distintos aplicados**

---

## Conclusión

El proyecto demuestra una arquitectura sólida y sostenible, aplicando patrones de diseño reconocidos que facilitan el mantenimiento, la extensibilidad y la calidad del software. La separación clara de responsabilidades y el uso de abstracciones permiten que el sistema evolucione sin comprometer la estabilidad del código existente.