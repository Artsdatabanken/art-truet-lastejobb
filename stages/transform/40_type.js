const { io, url } = require("lastejobb");

let tre = io.lesTempJson("art-truet-ubehandlet/type.json");
tre["RL"].foreldre = []
tre["RL"].tittel = { nb: 'Truet art/natur' }
new url(tre).assignUrls()
io.skrivBuildfil("type", tre);
