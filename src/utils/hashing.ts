import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

export const verify = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
