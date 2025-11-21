import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class PaymentApi extends HttpClient {
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

  manualPaymentEntryConfig = ApiRoutes.Payment.manualPaymentEntry;
  getReminderPaymentConfig = ApiRoutes.Payment.getReminderPayment;
  getPaymentHistoryForPropertyConfig = ApiRoutes.Payment.getPaymentHistoryForProperty;
  createPaymentConfig = ApiRoutes.Payment.createPayment;

  postProperty = async (reqBody) => {
    return this.instance({
      method: this.manualPaymentEntryConfig.Method,
      url: this.manualPaymentEntryConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };

  getReminderPayment = async (propertyId) => {
    return this.instance({
      method: "GET",
      url: `${this.getReminderPaymentConfig.Endpoint}?propertyId=${propertyId}`,
    });
  };

  getPaymentHistoryForProperty = async (propertyId, status) => {
  const query = status ? `?status=${status}&propertyId=${propertyId}` : `?propertyId=${propertyId}`;
  return this.instance({
    method: this.getPaymentHistoryForPropertyConfig.Method,
    url: `${this.getPaymentHistoryForPropertyConfig.Endpoint}${query}`,
  });
};

 createPayment = async (reqBody) => {
    return this.instance({
      method: this.createPaymentConfig.Method,
      url: this.createPaymentConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };

}

export default PaymentApi;
