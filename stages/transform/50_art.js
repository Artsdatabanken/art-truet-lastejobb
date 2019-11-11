const { io } = require("lastejobb");

let tre = io.lesDatafil("37_områder");
io.skrivBuildfil("art", tre);
