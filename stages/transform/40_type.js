const { io, url } = require("lastejobb");

let tre = io.lesTempJson("art-truet-ubehandlet/type.json");
new url(tre).assignUrls();

io.skrivBuildfil("type", tre);
