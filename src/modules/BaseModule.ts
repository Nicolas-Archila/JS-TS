import { Clock } from "../aplication/ports/Clock";
import { EventBus } from "../aplication/ports/EventBus";


export abstract class BaseModule<Repository> {
    constructor(
        protected readonly repo: Repository,
        protected readonly bus: EventBus,
        protected readonly clock: Clock,
    ) {}
}