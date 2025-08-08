import bcrypt from "bcryptjs";

const plainPassword = "psycheadmin123";
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds).then(hash => {
  console.log("Hashed Password:\n", hash);
});
