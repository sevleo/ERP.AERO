"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLatency = calculateLatency;
function calculateLatency() {
    const start = process.hrtime();
    // Simulate some processing time
    const end = process.hrtime(start);
    const latency = end[0] * 1e3 + end[1] * 1e-6; // Convert to milliseconds
    return latency;
}
