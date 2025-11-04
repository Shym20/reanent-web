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
  updateInterestStatusConfig = ApiRoutes.Owner.updateInterestStatus;
  submitFormStartTenancyFromOwnerConfig = ApiRoutes.Owner.submitFormStartTenancyFromOwner;
  ownerPropertyChannelConfig = ApiRoutes.Owner.ownerPropertyChannel;
  getChannelConversationByIdConfig = ApiRoutes.Owner.getChannelConversationById;


  getTenantInterests = async ({ status = "", page = 1, limit = 10 }) => {
    return this.instance({
      method: this.getTenantInterestsConfig.Method,
      url: `${this.getTenantInterestsConfig.Endpoint}status=${status}&page=${page}&limit=${limit}`,
    });
  };

  updateInterestStatus = async (payload) => {
    return this.instance({
      method: this.updateInterestStatusConfig.Method,
      url: `${this.updateInterestStatusConfig.Endpoint}`,
      data: payload,
    });
  };

  submitFormStartTenancyFromOwner = async (payload) => {
    return this.instance({
      method: this.submitFormStartTenancyFromOwnerConfig.Method,
      url: `${this.submitFormStartTenancyFromOwnerConfig.Endpoint}`,
      data: payload,
    });
  };

  ownerPropertyChannel = async () => {
    return this.instance({
      method: this.ownerPropertyChannelConfig.Method,
      url: `${this.ownerPropertyChannelConfig.Endpoint}`,
    });
  };

   getChannelConversationById = async (conversationId) => {
    return this.instance({
      method: this.getChannelConversationByIdConfig.Method,
      url: `${this.getChannelConversationByIdConfig.Endpoint}/${conversationId}/messages`,
    });
  };


}

export default OwnerApi;
