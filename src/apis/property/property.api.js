import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class PropertyApi extends HttpClient {
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

  postPropertyConfig = ApiRoutes.Property.postProperty;
  getMyPropertiesConfig = ApiRoutes.Property.getMyProperties;
  searchPropertiesConfig = ApiRoutes.Property.searchProperties;
  getPropertyDetailConfig = ApiRoutes.Property.getPropertyDetail;
  getTenantInterestsOfPropertyConfig = ApiRoutes.Property.getTenantInterestsOfProperty;
  associateTenantConfig = ApiRoutes.Property.associateTenant;
  deAssociateTenantConfig = ApiRoutes.Property.deAssociateTenant;
  deletePropertyConfig = ApiRoutes.Property.deleteProperty;
  editPropertyConfig = ApiRoutes.Property.editProperty;
  togglePropertyVisibiltyConfig = ApiRoutes.Property.togglePropertyVisibility;

  postProperty = async (reqBody) => {
    return this.instance({
      method: this.postPropertyConfig.Method,
      url: this.postPropertyConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };

  getMyProperties = async () => {
    return this.instance({
      method: this.getMyPropertiesConfig.Method,
      url: this.getMyPropertiesConfig.Endpoint,
    });
  };


  searchProperties = async (filters = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== "" && value !== "Any") {
        queryParams.append(key, value);
      }
    });

    return this.instance({
      method: this.searchPropertiesConfig.Method,
      url: `${this.searchPropertiesConfig.Endpoint}${queryParams.toString()}`,
    });
  };

  getPropertyDetail = async (propertyId) => {
    return this.instance({
      method: this.getPropertyDetailConfig.Method,
      url: `${this.getPropertyDetailConfig.Endpoint}/${propertyId}`,
    });
  };

  getTenantInterestsOfProperty = async (propertyId) => {
    return this.instance({
      method: this.getTenantInterestsOfPropertyConfig.Method,
      url: `${this.getTenantInterestsOfPropertyConfig.Endpoint}/${propertyId}`,
    });
  };

  associateTenant = async (payload) => {
    return this.instance({
      method: this.associateTenantConfig.Method,
      url: this.associateTenantConfig.Endpoint,
      data: payload,
    });
  };

  deAssociateTenant = async (payload) => {
    return this.instance({
      method: this.deAssociateTenantConfig.Method,
      url: this.deAssociateTenantConfig.Endpoint,
      data: payload,
    });
  };

  deleteProperty = async (propertyId) => {
    return this.instance({
      method: this.deletePropertyConfig.Method,
      url: `${this.deletePropertyConfig.Endpoint}/${propertyId}`,
    });
  };

  editProperty = async (propertyId, payload) => {
    return this.instance({
      method: this.editPropertyConfig.Method,
      url: `${this.editPropertyConfig.Endpoint}/${propertyId}`,
      data: payload,
    });
  };


  togglePropertyVisibilty = async (propertyId) => {
    return this.instance({
      method: this.togglePropertyVisibiltyConfig.Method,
      url: `${this.togglePropertyVisibiltyConfig.Endpoint}/${propertyId}`,
    });
  };

}

export default PropertyApi;
