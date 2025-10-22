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

  registerInterest = async (propertyId) => {
    return this.instance({
      method: this.registerInterestConfig.Method,
      url: `${this.registerInterestConfig.Endpoint}/${propertyId}`,
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

 




}

export default TenantApi;
