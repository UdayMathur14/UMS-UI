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
