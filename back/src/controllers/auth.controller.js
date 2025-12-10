const { playerSchema } = require("../helpers/player-schema");
const Player = require("../db/models/Player");
const bcrypt = require("bcryptjs");
const HTTPError = require("../helpers/custom-error");
const jwt = require("jsonwebtoken");

class AuthController {
  async signup(req, res, next) {
    const { error, value: playerInfo } = playerSchema.validate(req.body ?? {}, {
      abortEarly: false,
    }); //abort early to show all validations errors at the same time

    //invalid data
    if (error) throw new HTTPError(400, error.message);
    playerInfo.password = await bcrypt.hash(playerInfo.password, 10);

    try {
      await Player.create(playerInfo);
      res.status(201).json({
        message: "Joueur enrégistré",
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new HTTPError(409, "Cette addresse est déjà enrégistrée!");
      }
      next(error);
    }
  }

  async signin(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new HTTPError(400, "Email et mot de passe requis!");
      }

      const foundPlayer = await Player.findOne({ where: { email }, raw: true });
      if (!foundPlayer) {
        throw new HTTPError(400, "Email ou mot de passe incorrecte!");
      }

      const passwordMatch = await bcrypt.compare(
        password,
        foundPlayer.password,
      );
      if (!passwordMatch) {
        throw new HTTPError(400, "Email ou mot de passe incorrecte");
      }

      //creating token
      const token = jwt.sign({ id: foundPlayer.id }, process.env.JWT_SECRET, {
        expiresIn: "72h",
      });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
