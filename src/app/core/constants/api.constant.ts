import { environment } from '../../../enviornments/enviornment';

const apiPath = environment.apiPath;

export const APIConstant = {
  basePath: apiPath,
  signUp: `${apiPath}/api/v1/SignUp/create`,
};
