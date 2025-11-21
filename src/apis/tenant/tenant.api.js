import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class TenantApi extends HttpClient {
  constructor() {
    super(baseURL);
    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${getTokenLocal()}`;
      config.headers["ngrok-skip-browser-warning"] = `true`;

      config.headers["authkey"] = import.meta.env.VITE_AUTH_KEY;
      return config;
    });
  };

  _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (response) => {
        return Promise.resolve(response);
      }
    );
  };

  registerInterestConfig = ApiRoutes.Tenant.registerInterest;
  getAllInterestsConfig = ApiRoutes.Tenant.getAllInterests;
  savePropertyConfig = ApiRoutes.Tenant.saveProperty;
  unsavePropertyConfig = ApiRoutes.Tenant.unsaveProperty;
  getAllSavedPropertyConfig = ApiRoutes.Tenant.getAllSavedProperty;
  acceptStartTenancyConfig = ApiRoutes.Tenant.acceptStartTenancy;
  rejectStartTenancyConfig = ApiRoutes.Tenant.rejectStartTenancy;
  getMyCurrentStayConfig = ApiRoutes.Tenant.getMyCurrentStay;


registerInterest = async (propertyId, message) => {
  return this.instance({
    method: this.registerInterestConfig.Method,
    url: `${this.registerInterestConfig.Endpoint}/${propertyId}`,
    data: { message }, 
    headers: {},
  });
};
getAllInterests = async () => {
    return this.instance({
      method: this.getAllInterestsConfig.Method,
      url: this.getAllInterestsConfig.Endpoint,
      headers: {},
    });
};
saveProperty = async (propertyId) => {
  return this.instance({
    method: this.savePropertyConfig.Method,
    url: `${this.savePropertyConfig.Endpoint}/${propertyId}`, 
    headers: {},
  });
};
unsaveProperty = async (propertyId) => {
  return this.instance({
    method: this.unsavePropertyConfig.Method,
    url: `${this.unsavePropertyConfig.Endpoint}/${propertyId}`, 
    headers: {},
  });
};
getAllSavedProperty = async () => {
  return this.instance({
    method: this.getAllSavedPropertyConfig.Method,
    url: `${this.getAllSavedPropertyConfig.Endpoint}`, 
    headers: {},
  });
};
acceptStartTenancy = async (tenantStayId) => {
  return this.instance({
    method: this.acceptStartTenancyConfig.Method,
    url: this.acceptStartTenancyConfig.Endpoint,
    data: { tenantStayId },
    headers: {},
  });
};

rejectStartTenancy = async (tenantStayId, remarks) => {
  return this.instance({
    method: this.rejectStartTenancyConfig.Method,
    url: this.rejectStartTenancyConfig.Endpoint,
    data: { tenantStayId, remarks },
    headers: {},
  });
};

getMyCurrentStay = async () => {
  return this.instance({
    method: this.getMyCurrentStayConfig.Method,
    url: `${this.getMyCurrentStayConfig.Endpoint}`, 
    headers: {},
  });
};


}

export default TenantApi;
