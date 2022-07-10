import {WasmManager} from './WasmManager';

let wasmManager: WasmManager | null = null;

function executeFunction<T extends WasmManager>(target: T, func: keyof T, args: any): void {
    (target[func] as unknown as Function)(args);
}

self.addEventListener('message', e => {
    const message = e.data || e;

    switch (message.type) {
        case 'init':
            wasmManager = new WasmManager();
            wasmManager.init();
            break;

        case 'exec':
            if (wasmManager) {
                executeFunction(wasmManager, message.func, message.args);
            }
            break;

        default:
            break;
    }
});