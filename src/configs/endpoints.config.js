export const HttpMethod = {
  Get: "GET",
  Post: "POST",
  Put: "PUT",
  Patch: "PATCH",
  Delete: "DELETE",
};

const ApiRoutes = {
  Auth: {
    Login: {
      Endpoint: "/api/auth/login",
      Method: HttpMethod.Post,
    },
    Signup: {
      Endpoint: "/api/auth/register",
      Method: HttpMethod.Post,
    },
    ForgetPassword: {
      Endpoint: "/api/auth/forget-password",
      Method: HttpMethod.Post,
    },
    VerifyOtp: {
      Endpoint: "/api/auth/verify-otp",  
      Method: HttpMethod.Post,
    },
    ResetPassword: {
      Endpoint: "/api/auth/reset-password",
      Method: HttpMethod.Post,
    },
  },
  Profile: {
    GetProfile: {
      Endpoint: "/api/user/profile/get-profile",
      Method: HttpMethod.Get,
    },
    UpdateProfile: {
      Method: HttpMethod.Put,
      Endpoint: "/api/user/profile/update-profile",
    },
    GetSurveyAnwers : {
      Method: HttpMethod.Get,
      Endpoint: "/api/user/survey/get-all-answers",
    },
    UpdateSurveyAnwers: {
      Method: HttpMethod.Patch,
      Endpoint: "api/user/survey/update-answer/",
    },
  },
  Property: {
    postProperty: {
      Endpoint: "/api/user/property/post-property/",
      Method: HttpMethod.Post,
    },
    editProperty: {
      Endpoint: `/api/user/property/update-property-details`,
      Method: HttpMethod.Patch,
    },
    getMyProperties: {
      Endpoint: "/api/user/property/get-all-posted-properties",
      Method: HttpMethod.Get,
    },
    searchProperties: {
      Endpoint: "/api/user/property/search?",
      Method: HttpMethod.Get,
    },
    getPropertyDetail: {
      Endpoint: "/api/user/property/get-property-details",
      Method: HttpMethod.Get,
    },
    getTenantInterestsOfProperty: {
      Endpoint: "/api/user/property/interest/get-all-interest-by-property-id",
      Method: HttpMethod.Get,
    },
    associateTenant: {
      Endpoint: "/api/user/property/associate-tenant",
      Method: HttpMethod.Patch,
    },
    deAssociateTenant: {
      Endpoint: "api/user/property/deassociate-tenant",
      Method: HttpMethod.Patch,
    },
    deleteProperty: {
      Endpoint: "api/user/property/delete-property",
      Method: HttpMethod.Delete,
    },
    togglePropertyVisibility: {
      Endpoint: "api/user/property/toggle-visiblity",
      Method: HttpMethod.Patch,
    },
  },
  Tenant: {
    registerInterest: {
      Endpoint: "api/user/property/interest/register-interest",
      Method: HttpMethod.Post,
    },
    getAllInterests: {
      Endpoint: "api/user/property/interest/get-all-previous-intersets-on-properties",
      Method: HttpMethod.Get,
    },
    saveProperty: {
      Endpoint: "api/user/property/save",
      Method: HttpMethod.Post,
    },
    unsaveProperty: {
      Endpoint: "api/user/property/save",
      Method: HttpMethod.Delete,
    },
    getAllSavedProperty: {
      Endpoint: "api/user/property/saved",
      Method: HttpMethod.Get,
    },
    acceptStartTenancy: {
      Endpoint: "api/user/property/tenant-approve",
      Method: HttpMethod.Patch,
    },
     rejectStartTenancy: {
      Endpoint: "api/user/property/tenant-reject",
      Method: HttpMethod.Patch,
    }
  },
  Owner: {
    getTenantInterests: {
      Endpoint: "api/user/property/interest/owner-interests?",
      Method: HttpMethod.Get,
    },
    updateInterestStatus: {
      Endpoint: "api/user/property/interest/update-status",
      Method: HttpMethod.Patch,
    },
    ownerPropertyChannel: {
      Endpoint: "api/user/property/conversations",
      Method: HttpMethod.Get,
    },
    getChannelConversationById: {
      Endpoint: "api/user/property/conversation",
      Method: HttpMethod.Get,
    },
    submitFormStartTenancyFromOwner: {
      Endpoint: "api/user/property/request-tenant",
      Method: HttpMethod.Patch,
    },
  },
  Chat: {
    sendMessage: {
      Endpoint: "api/user/property/conversation",
      Method: HttpMethod.Post,
    },
  },
  Notification: {
    GetAllNotification: {
      Endpoint: "/api/user/notifications",
      Method: HttpMethod.Get,
    },
  },
};

export default ApiRoutes;
