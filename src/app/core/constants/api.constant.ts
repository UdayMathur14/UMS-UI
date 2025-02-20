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
  lookup: `${apiPath}/api/v1/lookup/search`,
  lookupCreate: `${apiPath}/api/v1/lookup/create`,
  lookupUpdate: `${apiPath}/api/v1/lookup/update`,
  lookupById: `${apiPath}/api/v1/lookup`,
  lookupType: `${apiPath}/api/v1/lookup-type/search`,

  role: `${apiPath}/api/v1/role/search`,
  createRole: `${apiPath}/api/v1/role/create`,
  updateRole: `${apiPath}/api/v1/role/update`,
  roleById: `${apiPath}/api/v1/role`,
};
