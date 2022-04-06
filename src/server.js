import express from "express";
import AuthRoutes from "./Routes/Auth";
import TaskRoutes from "./Routes/Task";

const server = express();

server.use(AuthRoutes);
server.use(TaskRoutes);

const port = 4321;

server.listen(port, () => {
  console.log(`Server started on PORT ${port} 🚀`);
});
