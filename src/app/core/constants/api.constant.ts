import { environment } from '../../../enviornments/enviornment';

const apiPath = environment.apiPath;
const umsURL = environment.umsURL;

export const APIConstant = {
  Ums: umsURL,
  basePath: apiPath,
  signUp: `${apiPath}/api/v1/SignUp/create`,
  signupStatus: `${apiPath}/api/v1/SignUp/search`,
  loginUserStatus: `${apiPath}/api/v1/SignUp/get`,
  signupStatusDataById: `${apiPath}/api/v1/SignUp`,
  signupStatusUpdate: `${apiPath}/api/v1/SignUp/update`,
  login: `${apiPath}/api/v1/login/login`,
  userMaster: `${apiPath}/api/v1/user/search`,
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
  domainProject: `${apiPath}/api/v1/domain-Project/search`,
  domainProjectCreate: `${apiPath}/api/v1/domain-Project/create`,
  updateDomainProject: `${apiPath}/api/v1/domain-Project/update`,
  domainProjectById: `${apiPath}/api/v1/domain-Project`,
  appMenuMapping: `${apiPath}/api/v1/app-menu/search`,
  appMenuCreate: `${apiPath}/api/v1/app-menu/create`,
  appMenuGetById: `${apiPath}/api/v1/app-menu/appMenuId`,
  updateAppMenu: `${apiPath}/api/v1/app-menu/update`,

  roleAppMenuMapping: `${apiPath}/api/v1/role-app-menu/search`,
  roleAppMenuCreate: `${apiPath}/api/v1/role-app-menu/create`,
  roleAppMenuGetById: `${apiPath}/api/v1/role-app-menu`,
  updateroleAppMenu: `${apiPath}/api/v1/role-app-menu/update`,

  forgetPassword: `${apiPath}/api/v1/user-setup/forget-password`,
  changePassword:`${apiPath}/api/v1/user-setup/change-password`,
  organisationsData: `${apiPath}/api/v1/domainsearch/search`,

  uploadUsers: `${apiPath}/api/v1/user/upload-users`,
};
