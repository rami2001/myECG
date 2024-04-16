// Liste d'origines de requêtes permises
const whitelist = ["http://localhost:3500"];

const corsOptions = {
  origin: (origin, callblack) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callblack(null, true);
    } else {
      callblack(new Error("Non permis par CORS"));
    }
  },
};

module.exports = { corsOptions };
