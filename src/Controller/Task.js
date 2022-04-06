import { DbConfig } from "../Config/db.config";

export class TaskController {
  async createTask(request, response) {
    const { name, owner, dueDate } = request.body;

    if (!name || !owner || !dueDate) {
      return response
        .status(400)
        .json({ msg: "All fields are required to create a task" });
    }

    try {
      const pool = new DbConfig().getPool();
      const pgClient = await pool.connect();

      const query = {
        text: "INSERT INTO Task (name, owner, dueDate) VALUES ($1, $2, $3)",
        values: [name, owner, dueDate],
      };

      await pgClient.query(query);
      pgClient.release();

      return response.status(201).json({ msg: "Task is created" });
    } catch (error) {
      return response.status(500).json(error);
    }
  }


  async markTaskAsDone(request, response) {
    const { email , isDone} = request.body;

    try {
      const pool = new DbConfig().getPool();
      const pgClient = await pool.connect();

      let query = {
        text: "SELECT id FROM Account WHERE email = $1",
        values: [email],
      }

      const account = await (await pgClient.query(query)).rows[0];
      console.log(account);

      query = {
        text: "UPDATE Task SET isDone = $1 WHERE owner = $2",
        values: [isDone, account.id],
      }

      await pgClient.query(query);
      pgClient.release();

      if (isDone == true) {
        return response.status(201).json({ msg: "Task is completed" });
      }
      
      if (isDone == false) {
        return response.status(201).json({ msg: "Task is incomplete" });
      }

    } catch (error) {
      response.status(500).json(error)
    }
  }


  async updateTask(request, response) {
    const { email, newDueDate } = request.body;

    const dueDate = newDueDate;

    try {
      const pool = new DbConfig().getPool();
      const pgClient = await pool.connect();

      let query = {
        text: "SELECT id FROM Account WHERE email = $1",
        values: [email],
      }

      const account = (await pgClient.query(query)).rows[0];

      query = {
        text: "UPDATE Task SET dueDate = $1 WHERE owner = $2",
        values: [dueDate, account.id]
      }

      const tasks = (await pgClient.query(query));
      console.log(tasks);
      pgClient.release();
      return response.status(201).json({ msg: "update complete" });

    } catch (error) {
      response.status(500).json(error)
    }
  }


  async deleteTask(request, response) {
    const { email, name } = request.body;

    try {
      const pool = new DbConfig().getPool();
      const pgClient = await pool.connect();

      let query = {
        text: "SELECT id FROM Account WHERE email = $1",
        values: [email],
      }

      const account = await (await pgClient.query(query)).rows[0];

      query = {
        text: "DELETE FROM Task WHERE name = $1",
        values: [name],
      };

      const tasks = (await pgClient.query(query)).rows;
      pgClient.release();
      return response.status(201).json({ msg: "Task is deleted" });

    } catch (error) {
      return response.status(500).json(error)
    }
  }
  

  async getTask(request, response) {
    const { email } = request.body;

    try {
      const pool = new DbConfig().getPool();
      const pgClient = await pool.connect();

      let query = {
        text: "SELECT id FROM Account WHERE email = $1",
        values: [email],
      };

      const account = await (await pgClient.query(query)).rows[0];

      query = {
        text: "SELECT * FROM Task WHERE owner = $1",
        values: [account.id],
      };


      const tasks = (await pgClient.query(query)).rows;
      pgClient.release();
      return response.status(200).json({ tasks });
    } catch (error) {
      return response.status(500).json(error);
    }
  }
}
