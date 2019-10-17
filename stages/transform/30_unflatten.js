const { io, log, json, text } = require("lastejobb");

const src = io.lesDatafil("Alle artsgrupper SLICER").items;
const r = {};

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
  const kode = taxonId2kode[e["Vitenskapelig navn"].toLowerCase()];
  if (!kode)
    return log.warn(
      "Mangler kode for '" + e["Vitenskapelig navn"] + "' taxonId " + taxonId
    );
  json.moveKey(e, "Tolig utdødd", "Trolig utdødd");
  json.moveKey(e, "2015KAT(uten gradtegn)", "kategori");
  json.moveKey(e, "2010KAT(uten gradtegn)", "2010.kategori");
  json.moveKey(e, "2010 kriterier", "2010.kriterier");
  e.år = 2015;
  const f = { 2010: e[2010], gjeldende: e };
  if (e[2010]) e[2010].år = 2010;
  //  if (e["2010 kategori"]) e[2010] = { kategori: e["2010 kategori"] };
  const stedkey = sted[e.Region[0]];
  if (!r[kode]) r[kode] = {};
  f.lenke = {
    rødliste: `https://artsdatabanken.no/Rodliste2015/rodliste2015/${stedkey}/${kode.substring(
      3
    )}`
  };
  r[kode][stedkey] = f;
  redundant.forEach(key => delete e[key]);
});

io.skrivDatafil(__filename, r);
