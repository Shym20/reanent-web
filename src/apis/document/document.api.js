import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class DocumentApi extends HttpClient {
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

    uploadDocumentConfig = ApiRoutes.Document.uploadDocument;
    getDocumentConfig = ApiRoutes.Document.getDocument;
    deleteDocumentConfig = ApiRoutes.Document.deleteDocument;


    uploadDocument = async (reqBody) => {
        return this.instance({
            method: this.uploadDocumentConfig.Method,
            url: this.uploadDocumentConfig.Endpoint,
            data: reqBody,
        });
    };

    getDocument = async (propertyId) => {
  return this.instance({
    method: this.getDocumentConfig.Method,
    url: `${this.getDocumentConfig.Endpoint}/${propertyId}`,
  });
};

 deleteDocument = async (docId) => {
  return this.instance({
    method: this.deleteDocumentConfig.Method,
    url: `${this.deleteDocumentConfig.Endpoint}/${docId}`,
  });
};


}

export default DocumentApi;
