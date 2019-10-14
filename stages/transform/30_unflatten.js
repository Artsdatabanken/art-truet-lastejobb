const { io, log, text } = require("lastejobb");

const src = io.lesDatafil("Alle artsgrupper SLICER").items;
const r = [];

const taxonId2kode = readTaxonIdMap();

function readTaxonIdMap() {
  const aa = io.lesDatafil("art-takson/sciName2ValidSciNameId").items;
  const name2kode = {};
  aa.forEach(e => {
    let key = e.name;
    key = key.replace(" var.", "");
    key = key.replace(" subsp.", "");
    name2kode[key] = "AR-" + e.id;
  });
  return name2kode;
}

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
  const parts = e["Takson id"].split("/");
  const taxonId = parts.pop();
  e.kode = taxonId2kode[e["Vitenskapelig navn"].toLowerCase()];
  if (!e.kode)
    return log.warn(
      "Mangler kode for '" + e["Vitenskapelig navn"] + "' taxonId " + taxonId
    );
  const sted = e.Region[0];
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
