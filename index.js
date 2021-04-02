const core = require("@actions/core");
const WebSocket = require("ws");

const STDOUT_CHUNK_PREFIX = 0;
const STDERR_CHUNK_PREFIX = 1;

try {
    const url = core.getInput('url', { required: true });
    const nonce = falseIfEmpty(core.getInput('nonce'));
    const websocket = new WebSocket(url);

    websocket.onmessage = (e) => {
        if (typeof e.data === "string") {
            throw new Error(e.data);
        }
        else if (e.data instanceof Buffer) {
            const buffer = new Uint8Array(e.data);

            if (buffer[0] === STDOUT_CHUNK_PREFIX) {
                process.stdout.write(buffer.slice(1));
            }
            else if (buffer[0] === STDERR_CHUNK_PREFIX) {
                process.stderr.write(buffer.slice(1));
            }
            else {
                throw new Error(`unsure how to handle buffer prefix: ${buffer[0]}`);
            }
        }
        else {
            throw new Error(`unhandled message payload '${e.data}'`);
        }
    };

    websocket.onopen = () => {
        console.log("triggercd-action: websocket connection established!");

        if (nonce !== false) {
            console.log("triggercd-action: sending nonce");
            websocket.send(nonce);
        }
    };

    websocket.onerror = (e) => {
        console.error(`triggercd-action: got websocket error ${e}`);
        throw new Error(e);
    };

    websocket.onclose = (e) => {
        console.log(`triggercd-action: websocket closed ${e.code}: ${e.reason}`);

        if (!e.wasClean) {
            console.error(`triggercd-action: unclean close`);
            throw new Error(e.reason);
        }
    };
}
catch (error) {
    core.setFailed(error.message);
}

/**
 * @param {string} input
 * @returns {false | string}
 */
function falseIfEmpty(input) {
    return !input ? false : input;
}
