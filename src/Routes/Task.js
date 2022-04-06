import { Router, json } from "express";
import { TaskController } from "../Controller/Task";

const router = Router();
const Controller = new TaskController();

router.post("/api/task", json(), (request, response) => {
  Controller.createTask(request, response);
});

router.get("/api/task/:id", json(), (request, response) => {
  Controller.markTaskAsDone(request, response);
});

router.patch("/api/task/:id", json(), (request, response) => {
  Controller.updateTask(request, response);
});

router.delete("/api/task", json(), (request, response) => {
  Controller.deleteTask(request, response);
});

router.get("/api/task-email", json(), (request, response) => {
  Controller.getTask(request, response);
});

export default router;
