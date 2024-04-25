import { USERNAME_REGEX } from '@/util/regex';

const validateUsername = (username) => USERNAME_REGEX.test(username);

export default validateUsername;
