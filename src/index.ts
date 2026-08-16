
// bukan web socket ------------------------------->
// import app from "./app";

// const port = 3000;

// app.listen(port, () => console.log("server is listening on port ", port))







// web socket ---------------------------------->
import app from "./app";
import { createServer } from "http";
import { initializeSocket } from "./socket";

const port = 3000

const server = createServer(app);

initializeSocket(server);

server.listen(port, () => {
    console.log("Server is running on port: ", port)
})