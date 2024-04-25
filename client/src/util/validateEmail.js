import { EMAIL_REGEX } from '@/util/regex';

const validateEmail = (email) => EMAIL_REGEX.test(email);

export default validateEmail;
