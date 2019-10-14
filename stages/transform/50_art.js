const { io } = require("lastejobb");

let tre = io.lesDatafil("30_unflatten");
io.skrivBuildfil("art", tre);
