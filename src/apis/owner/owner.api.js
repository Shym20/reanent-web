import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class OwnerApi extends HttpClient {
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

  getTenantInterestsConfig = ApiRoutes.Owner.getTenantInterests;
  

  getTenantInterests = async ({ status = "", page = 1, limit = 10 }) => {
  return this.instance({
    method: this.getTenantInterestsConfig.Method,
    url: `${this.getTenantInterestsConfig.Endpoint}status=${status}&page=${page}&limit=${limit}`,
  });
};


  

}

export default OwnerApi;
