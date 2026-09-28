/** Stagger helper for grids: each item waits a little longer than the one before (seconds). */
export const stagger = (i: number, step = 0.08, base = 0) => base + i * step;
