const { io } = require("lastejobb");

const r = io.lesTempJson("30_unflatten");

const pv = {};

Object.keys(r).forEach(kode => {
  const e = r[kode];
  if (!e.Påvirkningsfaktorer) return;
  const på = e.Påvirkningsfaktorer.replace(
    /Skogsdrift, hogst/g,
    "Skogsdrift; hogst"
  );
  //  if (på.indexOf("hogst") >= 0) debugger;
  const faktorer = på.split(",");
  faktorer.forEach(faktor => påvirk(faktor.split(" > "), pv));
});

function påvirk(tre, pv) {
  const n = tre.shift();
  if (!n) return;
  if (!pv[n]) pv[n] = {};
  påvirk(tre, pv[n]);
}

io.skrivDatafil(__filename, pv);
