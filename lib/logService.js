var TRACE = 0;
var DEBUG = 1;
var INFO = 2;
var WARN = 3;
var ERROR = 4;
var FATAL = 5;
var COLOR_WHITE = '\033[0m';
var COLOR_RED = '\033[31m';
var COLOR_GREEN = '\033[32m';
var COLOR_ORANGE = '\033[33m';
var COLOR_BLUE = '\033[34m';
var COLOR_PURPLE = '\033[35m';
var COLOR_GREEN_BLINK = '\033[32;5m';
var defaultLevel = TRACE;
var __base = __dirname;
function getLogger(name) {
}
function getLevel() {
    return defaultLevel;
}
function setLevel(level) {
    switch (level.toUpperCase()) {
        case 'TRACE':
            level = TRACE;
            break;
        case 'DEBUG':
            level = DEBUG;
            break;
        case 'INFO':
            level = INFO;
            break;
        case 'WARN':
        case 'WARNING':
            level = WARN;
            break;
        case 'ERROR':
            level = ERROR;
            break;
        case 'FATAL':
            level = FATAL;
            break;
    }
    console.log("Set log level to " + level);
    defaultLevel = level;
}
function trace(msg) {
    if (TRACE >= defaultLevel) {
        printMsg(COLOR_GREEN, "TRACE", msg);
    }
}
function debug(msg) {
    if (DEBUG >= defaultLevel) {
        printMsg(COLOR_ORANGE, "DEBUG", msg);
    }
}
function info(msg) {
    if (INFO >= defaultLevel) {
        printMsg(COLOR_WHITE, "INFO", msg);
    }
}
function warn(msg) {
    if (WARN >= defaultLevel) {
        printMsg(COLOR_BLUE, "WARN", msg);
    }
}
function error(msg) {
    if (ERROR >= defaultLevel) {
        printMsg(COLOR_PURPLE, "ERROR", msg);
    }
}
function errorWithStack(err) {
    if (ERROR >= defaultLevel) {
        printMsg(COLOR_PURPLE, "ERRORWITHSTACK", "Error: " + err + ", stack trace: " + err.stack);
    }
}
function fatal(msg) {
    if (FATAL >= defaultLevel) {
        printMsg(COLOR_RED, "FATAL", msg);
    }
}
function enter(arg) {
    if (TRACE >= defaultLevel) {
        var stack = require("stack-trace").get();
        var caller = stack[1];
        console.log("[" + COLOR_GREEN + "ENTER" + COLOR_WHITE + "][" + timestamp() + "][" + caller.getFileName().replace(__base, '') + "#" + caller.getLineNumber() + "@<" + caller.getFunctionName() + ">] " + COLOR_GREEN + "Enter <" + caller.getFunctionName() + ">(" + JSON.stringify(arg) + ") ..." + COLOR_WHITE);
    }
}
function leave(arg) {
    if (TRACE >= defaultLevel) {
        var stack = require("stack-trace").get();
        var caller = stack[1];
        console.log("[" + COLOR_GREEN + "TRACE" + COLOR_WHITE + "][" + timestamp() + "][" + caller.getFileName().replace(__base, '') + "#" + caller.getLineNumber() + "@<" + caller.getFunctionName() + ">] " + COLOR_GREEN + "Leave <" + caller.getFunctionName() + ">(" + JSON.stringify(arg) + ") ..." + COLOR_WHITE);
    }
}
function footprint() {
    if (TRACE >= defaultLevel) {
        var stack = require("stack-trace").get();
        var caller = stack[1];
        console.log("[" + COLOR_GREEN + "TRACE" + COLOR_WHITE + "][" + timestamp() + "][" + caller.getFileName().replace(__base, '') + "#" + caller.getLineNumber() + "@<" + caller.getFunctionName() + ">] " + COLOR_GREEN_BLINK + "FOOTPRINT" + COLOR_WHITE);
    }
}
function notImplemented() {
    if (TRACE >= defaultLevel) {
        var stack = require("stack-trace").get();
        var caller = stack[1];
        console.log("[" + COLOR_GREEN + "TRACE" + COLOR_WHITE + "][" + timestamp() + "][" + caller.getFileName().replace(__base, '') + "#" + caller.getLineNumber() + "@<" + caller.getFunctionName() + ">] " + COLOR_GREEN_BLINK + "!!! NOT IMPLEMENTED !!!" + COLOR_WHITE);
    }
}
function sql(s) {
    if (TRACE >= defaultLevel) {
        printMsg(COLOR_BLUE, "SQL", "Executing SQL: " + s);
    }
}
function sqlerr(err) {
    if (ERROR >= defaultLevel) {
        printMsg(COLOR_PURPLE, "ERROR", "SQL Error: " + err + ", stack trace: " + err.stack);
    }
}
function dump(obj) {
    if (TRACE >= defaultLevel) {
        if (typeof obj === "object") {
            if (obj instanceof Array) {
                var output = "";
                for (var i in obj) {
                    output += obj[i] + ",";
                }
                if (output[output.length - 1] === ',')
                    output = output.slice(0, -1);
                printMsg(COLOR_ORANGE, "DUMP", COLOR_GREEN + "VARIABLE: [" + output + "]" + COLOR_WHITE);
            }
            else {
                printMsg(COLOR_ORANGE, "DUMP", COLOR_GREEN + "VARIABLE: {");
                try {
                    Object.keys(obj).forEach(function (key) {
                        console.log("                                                             " + COLOR_GREEN + key + " : " + obj[key] + COLOR_WHITE);
                    });
                    console.log("                                                           " + COLOR_GREEN + "}" + COLOR_WHITE);
                }
                catch (TypeError) {
                    console.log("                                                           " + COLOR_GREEN + obj + COLOR_WHITE);
                }
            }
        }
        else if (typeof obj === "undefined") {
            printMsg(COLOR_ORANGE, "DUMP", COLOR_GREEN + "VARIABLE: " + COLOR_GREEN_BLINK + "undefined" + COLOR_WHITE);
        }
        else {
            printMsg(COLOR_ORANGE, "DUMP", COLOR_GREEN + "VARIABLE: " + obj + COLOR_WHITE);
        }
    }
}
function ndump(name, obj) {
    if (TRACE >= defaultLevel) {
        if (typeof obj !== "string" && typeof obj !== "number" && typeof obj !== "function")
            obj = JSON.stringify(obj);
        printMsg(COLOR_ORANGE, "DUMP", COLOR_GREEN + "VARIABLE<" + name + ">: " + obj + COLOR_WHITE);
    }
    return;
}
function timestamp() {
    var ts_hms = new Date();
    return ts_hms.getFullYear() + '-' +
        ("0" + (ts_hms.getMonth() + 1)).slice(-2) + '-' +
        ("0" + (ts_hms.getDate())).slice(-2) + ' ' +
        ("0" + ts_hms.getHours()).slice(-2) + ':' +
        ("0" + ts_hms.getMinutes()).slice(-2) + ':' +
        ("0" + ts_hms.getSeconds()).slice(-2) + '.' +
        ("000" + ts_hms.getMilliseconds()).slice(-3);
}
function printMsg(color, level, msg) {
    var stack = require("stack-trace").get();
    var caller = stack[2];
    console.log("[" + color + level + COLOR_WHITE + "][" + timestamp() + "][" + caller.getFileName().replace(__base, '') + "#" + caller.getLineNumber() + "@<" + caller.getFunctionName() + ">] " + color + msg + COLOR_WHITE);
}
exports.getLogger = getLogger;
exports.getLevel = getLevel;
exports.setLevel = setLevel;
exports.trace = trace;
exports.debug = debug;
exports.info = info;
exports.warn = warn;
exports.error = error;
exports.fatal = fatal;
exports.timestamp = timestamp;
exports.enter = enter;
exports.leave = leave;
exports.footprint = footprint;
exports.notImplemented = notImplemented;
exports.dump = dump;
exports.ndump = ndump;
exports.sql = sql;
exports.sqlerr = sqlerr;
exports.errorWithStack = errorWithStack;
