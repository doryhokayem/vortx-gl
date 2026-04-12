/**
 * Handler function that consumes event data.
 * T defaults to `unknown` for maximum safety.
 */
export type EventHandler<T = unknown> = (data: T) => void;
/**
 * Lightweight typed EventEmitter used internally by GraphEngine
 * to expose a clean `engine.on('node:click', handler)` API.
 */
export declare class EventEmitter {
    private listeners;
    /**
     * Subscribe to an event.
     * @param event The event unique key.
     * @param handler Function to execute when the event fires.
     * @returns An unsubscribe function for convenient cleanup.
     */
    on<T = unknown>(event: string, handler: EventHandler<T>): () => void;
    /**
     * Unsubscribe a specific handler from an event.
     */
    off<T = unknown>(event: string, handler: EventHandler<T>): void;
    /**
     * @internal
     * Fire an event to all current subscribers.
     */
    emit<T = unknown>(event: string, data?: T): void;
    /**
     * Remove all handlers for a specific event, or all events if no name given.
     */
    removeAllListeners(event?: string): void;
}
