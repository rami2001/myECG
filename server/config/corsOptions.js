const { allowedOrigins } = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callblack) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callblack(null, true);
    } else {
      callblack(new Error("Non permis par CORS"));
    }
  },
};

module.exports = { corsOptions };
