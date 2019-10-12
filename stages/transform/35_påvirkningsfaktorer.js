const { io } = require("lastejobb");

const r = io.lesDatafil("30_unflatten").items;

const pv = {};

r.forEach(e => {
  if (!e.Påvirkningsfaktorer) return;
  const på = e.Påvirkningsfaktorer.replace(
    /Skogsdrift, hogst/g,
    "Skogsdrift hogst"
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
