import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class ProfileApi extends HttpClient {
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

  getProfileConfig = ApiRoutes.Profile.GetProfile;
  updateProfileConfig = ApiRoutes.Profile.UpdateProfile;
  getSurveyAnswersConfig = ApiRoutes.Profile.GetSurveyAnwers;
  updateSurveyAnswersConfig = ApiRoutes.Profile.UpdateSurveyAnwers;
  searchPeopleConfig = ApiRoutes.Profile.SearchPeople;
  searchPeopleDetailConfig = ApiRoutes.Profile.SearchPeopleDetail;
  

  getProfile = async (reqBody) => {
    return this.instance({
      method: this.getProfileConfig.Method,
      url: this.getProfileConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };

  updateProfile = async (updateData) => {
    return this.instance({
      method: this.updateProfileConfig.Method,
      url: this.updateProfileConfig.Endpoint,
      headers: {},
      data: updateData,
    });
  };

  getSurveyAnswers = async () => {
    return this.instance({
      method: this.getSurveyAnswersConfig.Method,
      url: this.getSurveyAnswersConfig.Endpoint,
      headers: {},
    });
  };

  updateSurveyAnswer = async (questionId, answer) => {
  return this.instance({
    method: this.updateSurveyAnswersConfig.Method,
    url: `${this.updateSurveyAnswersConfig.Endpoint}${questionId}`,
    headers: { "Content-Type": "application/json" },
    data: { answer },
  });
};

 searchPeople = async (userId) => {
  return this.instance({
    method: this.searchPeopleConfig.Method,
    url: `${this.searchPeopleConfig.Endpoint}?query=${userId}`,
    headers: {},
  });
};

searchPeopleDetail = async (userId) => {
  return this.instance({
    method: this.searchPeopleDetailConfig.Method,
    url: `${this.searchPeopleDetailConfig.Endpoint}?userId=${userId}`,
    headers: {},
  });
};


}

export default ProfileApi;
