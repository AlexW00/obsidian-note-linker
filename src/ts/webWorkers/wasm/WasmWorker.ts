import {WasmManager} from './WasmManager';

let wasmManager: WasmManager | null = null;

function executeFunction<T extends WasmManager>(target: T, func: keyof T, args: any): void {
    (target[func] as unknown as Function)(args);
}

self.addEventListener('message', e => {
    const message = e.data || e;

    switch (message.type) {
        case 'init': {
            wasmManager = new WasmManager();
            wasmManager.init();
            break;
        }
        case 'exec':
            if (wasmManager && wasmManager.isReady()) {
                executeFunction(wasmManager, message.func, message.args);
            } else {
                console.error("WasmWorker is not ready!")
            }
            break;

        default:
            console.error("Function not found in WasmWorker!");
            break;
    }
});