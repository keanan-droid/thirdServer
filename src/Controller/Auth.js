import { compare } from "bcrypt";
import { genSalt, hash, bcrypt } from "bcrypt";
import { DbConfig } from "../Config/db.config";
import { jwt } from "jsonwebtoken";

export class AuthController {
  async signup(request, response) {
    const pool = new DbConfig().getPool(); 

    const { email, password, username } = request.body;

    if (!email || !password || !username) {
      return response
        .status(400)
        .json({ msg: "All fields are required to create account" });
    }


    try {

      const salt = await genSalt();
      const hashedPassword = await hash(password, salt);

      const pgClient = await pool.connect();

      const query = {
        text: "INSERT INTO Account (email, password, username) VALUES ($1, $2, $3)",
        values: [email, hashedPassword, username],
      };

      await pgClient.query(query);
      pgClient.release();

      return response.status(201).json({ msg: "Account created" });
    } catch (error) {
      return response.status(500).json(error);
    }
  }

  async signin(request, response) {
      const { email, password, username } = request.body;

      if (!email || !password || !username) {
        return response
        .status(400)
        .json({ msg: "All fileds are required to login" })
      }

    const query = {
      text: "SELECT * FROM Account WHERE email = $1",
      values: [email]
    }

    const pool = new DbConfig().getPool();

    try {

      const pgClient = await pool.connect();
      const account = await (await pgClient.query(query)).rows[0];

      if (!account) {
        return response
        .status(404)
        .json({ msg: "Account with this email does not exist" })
      }

      const isValidPassword = await compare(password, account.password)

      if (!isValidPassword) {
        return response.status(401).json({ msg: "Invalid credentials" });
      }

      pgClient.release();

      
      // const accessToken = jwt.sign(
      //   { email:email },
      //    process.env.ACCESS_TOKEN_SECRET, 
      //   { expiresIn: '15m'}
      // );

      // const refreshToken = jwt.sign(
      //   { email:email },
      //    process.env.REFRESH_TOKEN_SECRET, 
      //   { expiresIn: '1d'}
      // );

      // response.cookies('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000})

      return response.status(201).json({ msg: "welcome user" })

    } catch (error) {
      return response.status(500).json(error)
    }
  }

  async update(request, response ) {

    const pool = new DbConfig().getPool();

    const { email, password, username, setNewPassword } = request.body;

    if (!email || !password || !username || !setNewPassword) {
      return response
      .status(400)
      .json({ msg: "All fields are required to login" })
    }

    const salt = await genSalt();
    const hashedPassword = await hash(setNewPassword, salt);

    try {
      
      const pgClient = await pool.connect();

      const query = {
        text: "SELECT * FROM Account WHERE email = $1",
        values: [email]
      }

      const account = await (await pgClient.query(query)).rows[0];

      if (!account) {
        return response
        .status(404)
        .json({ msg: "Account with this email does not exist" })
      }

      const updateQuery = {
        text: "UPDATE Account SET password = $1 WHERE email = $2",
        values: [hashedPassword, email]
      }

      const newAccount = await (await pgClient.query(updateQuery)).rows[0];


      pgClient.release();
      return response.status(201).json({ msg: "Credientials updated" })

    } catch (error) {
      return response.status(500).json(error)
    }


  }
}
