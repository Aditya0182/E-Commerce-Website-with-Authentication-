const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

// Render provides a PORT environment variable, so use it
const PORT = process.env.PORT || 8080;  // 8080 is a fallback if PORT isn't provided
server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
});
