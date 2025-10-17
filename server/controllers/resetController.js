const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const { hash } = require("../util/hash");
require("dotenv").config();

const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

const getLink = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (user === null) {
    res
      .status(RESPONSE.CLIENT_ERROR.NOT_FOUND)
      .json({ message: "Compte introuvable." });

    return;
  }

  const resetToken = jwt.sign({ email }, process.env.EMAIL_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  const resetUrl = `${process.env.CLIENT}/home/login/reset/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADRESS,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ADRESS,
    to: email,
    subject: "myECG - Réinitialisation du mot de passe",
    html: `<p>Rendez-vous sur ce <a href="${resetUrl}">lien</a> pour réinitialiser votre mot de passe. Ce lien n'est valable que pour une heure.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);

    console.log(resetUrl);

    res.status(RESPONSE.SUCCESSFUL.OK).json({
      message:
        "Le lien de réinitialisation du mot de passe a été envoyé à votre e-mail.",
    });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: "Impossible d'envoyer l'e-mail." });
  }
};

const validateToken = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
    const email = decoded.email;

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user === null) {
      res
        .status(RESPONSE.CLIENT_ERROR.UNAUTHORIZED)
        .json({ message: "Lien invalide." });

      return;
    }

    res.sendStatus(RESPONSE.SUCCESSFUL.NO_CONTENT);
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: "Impossible de vérifier le lien." });
  }
};

const reset = async (req, res) => {
  const { password, token } = req.body;

  const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
  const email = decoded.email;

  const hashedPassword = await hash(password);

  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });

    res
      .status(RESPONSE.SUCCESSFUL.OK)
      .json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.log(error);
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: "Impossible de réinitialiser le mot de passe." });
  }
};

module.exports = { getLink, reset, validateToken };
