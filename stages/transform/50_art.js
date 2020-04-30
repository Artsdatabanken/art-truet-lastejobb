const { io } = require("lastejobb");

let tre = io.lesTempJson("37_områder");
io.skrivBuildfil("art", tre);
