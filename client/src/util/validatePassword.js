import { PASSWORD_REGEX } from "@/util/regex";

const validatePassword = (password) => PASSWORD_REGEX.test(password);

export default validatePassword;
