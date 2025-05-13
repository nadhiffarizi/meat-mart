import { genSalt, hash } from 'bcrypt';
export const hashedPassword = async (
  password: string,
  numberSalt: number = 10,
) => {
  const salt = await genSalt(numberSalt);
  const hashedPass = await hash(password, salt);
  console.log(hashedPass);

  return hashedPass
};
