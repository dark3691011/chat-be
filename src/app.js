const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const documents = {};
userList = [];

app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

io.on("connection", (socket) => {
  // let previousId;
  let name;
  // io.emit("documents", Object.keys(documents));

  console.log(`Socket ${socket.id} has connected`);
  userList.push(socket.id);
  // io.emit("users", userList);

  // const safeJoin = (currentId) => {
  //   console.log(currentId);
  //   socket.leave(previousId);
  //   socket.join(currentId, () =>
  //     console.log(`${previousId}, Socket ${socket.id} joined room ${currentId}`)
  //   );
  //   previousId = currentId;
  // };

  // socket.on("getDoc", (docId) => {
  //   safeJoin(docId);
  //   socket.emit("document", documents[docId]);
  // });
  // socket.on("send", (document) => {
  //   // safeJoin(docId);
  //   console.log("a");
  //   console.log(document);
  //   io.to(document.id).emit("document", document);
  //   // socket.to(document.id).emit("document", document);
  // });
  socket.on("set-name", (nameIn) => {
    name = nameIn;
    console.log(name);
  });
  socket.on("join", (nameIn) => {
    socket.join(nameIn);
  });
  socket.on("send", (message) => {
    let boxName = `${message.name1}-${message.name2}`;
    let boxName2 = `${message.name2}-${message.name1}`;
    io.to(boxName).emit("on-message", message);
    io.to(boxName2).emit("on-message", message);
  });
  // socket.on("addDoc", (doc) => {
  //   documents[doc.id] = doc;
  //   safeJoin(doc.id);
  //   io.emit("documents", Object.keys(documents));
  //   socket.emit("document", doc);
  // });

  // socket.on("editDoc", (doc) => {
  //   documents[doc.id] = doc;
  //   console.log("x");
  //   socket.to(doc.id).emit("document", doc);
  // });

  // socket.on("close", () => {
  //   console.log("â");
  //   userList.splice(
  //     userList.findIndex((e) => {
  //       e == socket.id;
  //     }),
  //     1
  //   );
  // });
});
http.listen(4444, () => {
  console.log("Listening on port 4444");
});
