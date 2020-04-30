const { io } = require("lastejobb");

let tre = io.lesTempJson("30_unflatten");
const område = io.lesTempJson("art-truet-ubehandlet/område");

Object.values(tre).forEach(rv => {
  if (rv.svalbard) flyttOmråder(rv.svalbard.gjeldende);
  if (rv.norge) flyttOmråder(rv.norge.gjeldende);
});

function flyttOmråder(risikovurdering) {
  if (!risikovurdering) return;
  Object.keys(område).forEach(tbf => {
    var v = risikovurdering[tbf];
    if (!v) return;
    delete risikovurdering[tbf];
    risikovurdering.utbredelse = risikovurdering.utbredelse || {};
    const utbredelse = risikovurdering.utbredelse;
    v = v.toLowerCase();
    utbredelse[v] = utbredelse[v] || [];
    const e = område[tbf];
    utbredelse[v].push(...e.koder)
    var set = new Set(utbredelse[v])
    utbredelse[v] = Array.from(set)
  });
}

io.skrivDatafil(__filename, tre);
