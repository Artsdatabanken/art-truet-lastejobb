const { io, text } = require("lastejobb");

const r = io.lesDatafil("Alle artsgrupper SLICER").items;

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
r.forEach(e => {
  Object.keys(e).forEach(key => (e[key] = text.decode(e[key])));
  e.kode = e["Takson id"].split("/").pop();
  redundant.forEach(key => delete e[key]);
  Object.keys(e).forEach(key => {
    const v = e[key];
    if (!x[key]) x[key] = {};
    x[key][v] = (x[key][v] || 0) + 1;
  });
});

io.skrivDatafil(__filename, r);
io.skrivDatafil("x.json", x);
