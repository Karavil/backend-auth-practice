const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
   jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET, function (
      err,
      decoded
   ) {
      if (err) {
         return res.status(401).json({
            message: "Unauthorized access. Please log in.",
         });
      }
      console.log(decoded);
      req.user = decoded;
      next();
   });
};
