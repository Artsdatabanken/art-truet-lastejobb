const { io, log, text } = require("lastejobb");

const src = io.lesDatafil("30_unflatten");
const diff = {};
const keys = {};

Object.values(src).forEach(e => {
  if (!e.N) return;
  Object.keys(e.N).forEach(key => {
    const N = e.N;
    const S = e.S;
    if (!S) return;
    keys[key] = 1;
    if (N[key] !== S[key]) diff[key] = 1;
  });
});

Object.keys(keys).forEach(key => {
  if (!diff[key]) log.warn(key);
});

io.skrivDatafil("diff", diff);
io.skrivDatafil("keys", keys);
