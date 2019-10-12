const { io } = require("lastejobb");

let tre = io.lesDatafil("art-truet-ubehandlet/type.json");
io.skrivBuildfil("type", tre);
