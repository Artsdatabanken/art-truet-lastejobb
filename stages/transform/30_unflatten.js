const { io, log, text } = require("lastejobb");

const src = io.lesDatafil("Alle artsgrupper SLICER").items;
const r = [];

const redundant = [
  "2010KAT(uten gradtegn)",
  "2015KAT(uten gradtegn)",
  "Norsk navn",
  "Taxon-nivå",
  "class",
  "kingdom",
  "order",
  "phylum",
  "Familie",
  "Ekspertgruppe",
  "Artsgruppe",
  "Kolonne1",
  "Takson id"
];
const x = {};
const y = {};
src.forEach(e => {
  Object.keys(e).forEach(key => (e[key] = text.decode(e[key])));
  const taxonid = e["Takson id"].split("/");
  e.kode = "AR-" + taxonid.pop();
  const sted = taxonid.pop();
  if (sted === "S") return;
  //  if (sted === "S" && e.Kategori2015 !== "LC") debugger;
  if (y[e.kode]) log.warn(e["Takson id"]);
  y[e.kode] = 1;
  redundant.forEach(key => delete e[key]);
  //if (!r[e.kode]) r[e.kode] = {};
  //  r[e.kode][sted] = e;
  r.push(e);
  Object.keys(e).forEach(key => {
    const v = e[key];
    if (!x[key]) x[key] = {};
    x[key][v] = (x[key][v] || 0) + 1;
  });
});

io.skrivDatafil(__filename, r);
io.skrivDatafil("x.json", x);
