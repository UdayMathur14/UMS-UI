import { environment } from '../../../enviornments/enviornment';

const apiPath = environment.apiPath;
const umsURL = environment.umsURL;

export const APIConstant = {
  Ums: umsURL,
  basePath: apiPath,
  signUp: `${apiPath}/api/v1/SignUp/create`,
  signupStatus: `${apiPath}/api/v1/SignUp/search`,
  signupStatusDataById: `${apiPath}/api/v1/SignUp`,
  signupStatusUpdate: `${apiPath}/api/v1/SignUp/update`,
  login: `${apiPath}/api/v1/login/login`,
  userMaster: `${apiPath}/api/v1/user/search/`,
  getUserMasterById: `${apiPath}/api/v1/user/`,
  userMasterUpdate: `${apiPath}/api/v1/user/update/`,
  createUserMaster: `${apiPath}/api/v1/user/create`,
};
