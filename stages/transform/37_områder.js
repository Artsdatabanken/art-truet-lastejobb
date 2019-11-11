const { io } = require("lastejobb");

let tre = io.lesDatafil("30_unflatten");
const område = io.lesDatafil("art-truet-ubehandlet/område");

Object.values(tre).forEach(rv => {
  if (rv.svalbard) flyttOmråder(rv.svalbard.gjeldende);
  if (rv.norge) flyttOmråder(rv.norge.gjeldende);
});

function flyttOmråder(rv) {
  if (!rv) return;
  Object.keys(område).forEach(tbf => {
    var v = rv[tbf];
    if (!v) return;
    delete rv[tbf];
    rv.utbredelse = rv.utbredelse || {};
    const u = rv.utbredelse;
    v = v.toLowerCase();
    u[v] = u[v] || [];
    const e = område[tbf];
    u[v].push(...e.koder);
  });
}

io.skrivDatafil(__filename, tre);
