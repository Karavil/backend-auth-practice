const router = require("express").Router();

const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
   const { username, password } = req.body;
   if (username && password) {
      const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 12;
      const hashedPass = bcrypt.hashSync(password, saltRounds);

      const newUser = await db.users.create({
         data: {
            username,
            password: hashedPass,
         },
      });

      res.status(201).json({
         message: `User created!`,
         user: {
            id: newUser.id,
         },
      });
   } else {
      res.status(400).json({
         message:
            "Please include a username and password in your request body.",
      });
   }
});

router.post("/login", async (req, res) => {
   const { username, password } = req.body;

   if (username && password) {
      const newUser = await db.users.findOne({
         where: {
            username,
         },
      });

      if (newUser === null) {
         return res
            .status(404)
            .json({ message: `User (${username}) not found.` });
      }

      if (bcrypt.compareSync(password, newUser.password) === true) {
         const token = jwt.sign({ username }, process.env.TOKEN_SECRET);
         return res.status(200).json({
            message: `Password approved, logging you in.`,
            token,
         });
      }

      return res.status(401).json({ message: "Invalid password." });
   }

   return res.status(400).json({
      message: "Please include a username and password in your request body.",
   });
});

module.exports = router;
