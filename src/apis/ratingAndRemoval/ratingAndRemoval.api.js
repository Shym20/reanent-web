import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class RatingAndRemovalApi extends HttpClient {
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

  initiateRemovalByOwnerConfig = ApiRoutes.RatingAndRemoval.initiateRemovalByOwner;
  checkRemoveStatusConfig = ApiRoutes.RatingAndRemoval.checkRemoveStatus;
  actionOnDeAssociationByTenantConfig = ApiRoutes.RatingAndRemoval.actionOnDeAssociationByTenant;
  initiateRemovalByTenantConfig = ApiRoutes.RatingAndRemoval.initiateRemovalByTenant;
  actionOnDeAssociationByOwnerConfig = ApiRoutes.RatingAndRemoval.actionOnDeAssociationByOwner;

  initiateRemovalByOwner = async (reqBody) => {
    return this.instance({
      method: this.initiateRemovalByOwnerConfig.Method,
      url: this.initiateRemovalByOwnerConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };

  checkRemoveStatus = async (tenantStayId) => {
    return this.instance({
      method: this.checkRemoveStatusConfig.Method,
      url: `${this.checkRemoveStatusConfig.Endpoint}/${tenantStayId}`,
      headers: {},
    });
  };

   actionOnDeAssociationByTenant = async (reqBody) => {
    return this.instance({
      method: this.actionOnDeAssociationByTenantConfig.Method,
      url: this.actionOnDeAssociationByTenantConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };

  initiateRemovalByTenant = async (reqBody) => {
    return this.instance({
      method: this.initiateRemovalByTenantConfig.Method,
      url: this.initiateRemovalByTenantConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };

   actionOnDeAssociationByOwner = async (reqBody) => {
    return this.instance({
      method: this.actionOnDeAssociationByOwnerConfig.Method,
      url: this.actionOnDeAssociationByOwnerConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };
  
}

export default RatingAndRemovalApi;
