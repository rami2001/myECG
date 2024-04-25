import { PSEUDONYM_REGEX } from "@/util/regex";

const validatePseudonym = (pseudonym) => PSEUDONYM_REGEX.test(pseudonym);

export default validatePseudonym;
