const { PrismaClient } = require("@prisma/client");
const multer = require("multer");

const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

const destination = "../images/users";

const ProfilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destination);
  },
  filename: async (req, file, cb) => {
    try {
      // Génerer un nom de fichier unique indépendant des informations de l'utilisateur
      const profilePictureFilename =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

      await prisma.user.update({
        where: {
          id: req.id,
        },
        data: {
          image: req.id + profilePictureFilename,
        },
      });

      cb(null, req.id + "-" + profilePictureFilename);
    } catch (error) {
      console.log(error);
    }
  },
});

const upload = multer({ storage: ProfilePictureStorage }).single("image");

const setProfilePicture = (req, res) => {
  console.log("Request", req.files);
  console.log("Request", req.file);
  // try {
  //   upload(req, res, async (error) => {
  //     if (!req.file)
  //       return res
  //         .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
  //         .json({ message: "No file uploaded" });

  //     if (error)
  //       return res
  //         .status(RESPONSE.CLIENT_ERROR.UNAUTHORIZED)
  //         .json({ message: "Veuillez vous authentifier." });

  //     res.status(RESPONSE.SUCCESSFUL.CREATED).send(req.file);
  //   });
  // } catch (error) {
  //   res
  //     .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
  //     .json({ message: error.message });
  // }

  res.sendStatus(200);
};

module.exports = { setProfilePicture };
