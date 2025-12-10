const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const PlayerController = require("../controllers/player.controller");
const authPlayer = require("../middlewares/user-auth");

router.post("/auth/login", AuthController.signin);
router.post("/auth/register", AuthController.signup);

router.get("/player", authPlayer, PlayerController.getPlayer);
router.get("/stats", authPlayer, PlayerController.getStats);
router.get("/stats/:state", authPlayer, PlayerController.getHistory);

router.get("/online-players", authPlayer, PlayerController.getOnlinePlayer);

module.exports = router;
