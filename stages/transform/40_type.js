const { io, url } = require("lastejobb");

let tre = io.lesDatafil("art-truet-ubehandlet/type.json");
new url(tre).assignUrls();

io.skrivBuildfil("type", tre);
