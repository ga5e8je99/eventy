import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'eventyplaner@gmail.com',     // ايميلك
    pass: 'rgdu jijk wulv uxmd',     // app password
  },
});
