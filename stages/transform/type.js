const { io } = require("lastejobb");

let tre = io.lesDatafil("truet-art/type.json");
io.skrivBuildfil("type", tre);
