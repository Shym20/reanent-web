// src/apis/notification.api.js
export async function registerFcmToken(fcmToken, jwtToken) {
  try {

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/notification/register-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          fcmToken,
          deviceType: "web",
        }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      console.log("✅ FCM token registered successfully", data);
    } else {
      console.error("❌ Failed to register FCM token", data);
    }
  } catch (err) {
    console.error("🔥 Error sending FCM token:", err);
  }
}

import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class NotificationApi extends HttpClient {
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

  getAllNotificationConfig = ApiRoutes.Notification.GetAllNotification;

 getAllNotification = async (page = 1, limit = 10) => {
  return this.instance({
    method: this.getAllNotificationConfig.Method,
    url: `${this.getAllNotificationConfig.Endpoint}?page=${page}&limit=${limit}`,
  });
};


}

export default NotificationApi;
