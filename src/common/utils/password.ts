import * as bcrypt from 'bcryptjs';

export const hashPassword = (plain: string) => bcrypt.hashSync(plain, 10);

export const comparePassword = (plain: string, hashed: string) =>
  bcrypt.compareSync(plain, hashed);
