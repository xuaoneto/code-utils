import { mailService } from "services/mail";
import rateLimit from "utils/rate-limit";
// import fs from "fs";

const sendMail = (name, phone, typeOfCase, commentOrMessage, email) => {
  const contactMailData = {
    from: process.env.NEXT_APP_EMAIL_AUTH_USER,
    to: process.env.NEXT_APP_EMAIL_TO,
    subject: `New Message <${email}>`,
    text: `Name:${name},\n\n
           Email:<${email}>\n\n
           Phone:${phone}\n\n
           Type of Case: ${typeOfCase}\n\n
           Message: ${commentOrMessage}\n\n
           `,
  };
  mailService.send(contactMailData);
};

// const getBase64 = file => {
//   return fs.readFileSync(file.filepath, { encoding: "base64" });
// };

const limiter = rateLimit({
  interval: 24 * 60 * 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await limiter.check(res, 3, "CACHE_TOKEN");
      const { name, phone, typeOfCase, commentOrMessage, email } = req.body;
      console.log(req.body);
      sendMail(name, phone, typeOfCase, commentOrMessage, email);

      return res.status(200).json({
        status: 200,
        ok: true,
        message: "Email sended",
      });
    } catch (error) {
      return res.status(200).json({
        status: 200,
        ok: true,
        message: "Email limit per day exceeded",
      });
    }
  } else {
    return res.status(404).end();
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
