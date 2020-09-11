export function eventHandler(handler) {
    return function(event) {
        event.preventDefault();
        handler();
    }
}