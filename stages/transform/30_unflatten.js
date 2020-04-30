const { io, log, json, text } = require("lastejobb");

const src = io.lesTempJson("Alle artsgrupper SLICER");
const r = {};

const taxonId2kode = readTaxonIdMap();

function readTaxonIdMap() {
  const aa = io.lesTempJson("art-takson/type");
  const name2kode = { preferred: {}, synonym: {} };
  aa.forEach(e => {
    add(name2kode.preferred, e.tittel.sn, e.kode);
    if (!e.synonym) return;
    if (!e.synonym.sn) return;
    e.synonym.sn.forEach(syn => {
      add(name2kode.synonym, syn, e.kode);
    });
  });
  return name2kode;
}

function add(dest, name, kode) {
  let key = name.toLowerCase();
  dest[key] = [...(dest[key] || []), kode];
  var key2 = key.replace(" agg.", "");
  key2 = key2.replace(" var.", "");
  key2 = key2.replace(" subsp.", "");
  if (key !== key2) dest[key2] = [...(dest[key2] || []), kode];
}

const sted = { S: "svalbard", N: "norge" };
const redundant = [
  "kode",
  "2010",
  "2010 kategori",
  "2010KAT(uten gradtegn)",
  "Kategori2015",
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
  "Region",
  "Kolonne1",
  "Takson id",
  "Vitenskapelig navn"
];
src.forEach(e => {
  Object.keys(e).forEach(key => (e[key] = text.decode(e[key])));
  const parts = e["Takson id"].split("/");
  const taxonId = parts.pop();
  const lowerName = e["Vitenskapelig navn"].toLowerCase();
  var koder = taxonId2kode.preferred[lowerName];
  if (!koder) koder = taxonId2kode.synonym[lowerName];
  if (lowerName === "chaetophora pisformis") debugger;
  if (!koder) {
    taxonId2kode[e["Vitenskapelig navn"].toLowerCase()];
    return log.warn(
      "Mangler kode for '" + e["Vitenskapelig navn"] + "' taxonId " + taxonId
    );
  }
  json.moveKey(e, "Tolig utdødd", "Trolig utdødd");
  json.moveKey(e, "2015KAT(uten gradtegn)", "kategori");
  json.moveKey(e, "2010KAT(uten gradtegn)", "2010.kategori");
  json.moveKey(e, "2010 kriterier", "2010.kriterier");
  e.år = 2015;
  const f = { 2010: e[2010], gjeldende: e };
  if (e[2010]) e[2010].år = 2010;
  //  if (e["2010 kategori"]) e[2010] = { kategori: e["2010 kategori"] };
  const stedkey = sted[e.Region[0]];
  if (koder.length > 1)
    log.warn(
      "Flere mulig treff for " +
      e["Vitenskapelig navn"] +
      ": " +
      koder.join(",")
    );
  const kode = koder[0];
  if (!r[kode]) r[kode] = {};
  e.lenke = {
    rødliste_2015: `https://artsdatabanken.no/Rodliste2015/rodliste2015/${stedkey}/${kode.substring(
      3
    )}`
  };
  r[kode][stedkey] = f;
  redundant.forEach(key => delete e[key]);
});

io.skrivDatafil(__filename, r);
