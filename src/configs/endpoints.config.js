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
    GetSurveyAnwers: {
      Method: HttpMethod.Get,
      Endpoint: "/api/user/survey/get-all-answers",
    },
    UpdateSurveyAnwers: {
      Method: HttpMethod.Patch,
      Endpoint: "api/user/survey/update-answer/",
    },
    SearchPeople: {
      Endpoint: "/api/user/profile/search",
      Method: HttpMethod.Get,
    },
    SearchPeopleDetail: {
      Endpoint: "/api/user/profile/search/details",
      Method: HttpMethod.Get,
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
    },
    getMyCurrentStay: {
      Endpoint: "api/user/property/stay/get-current-stay",
      Method: HttpMethod.Get,
    },
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
  Document: {
    uploadDocument: {
      Endpoint: "/api/user/property/document/upload",
      Method: HttpMethod.Post,
    },
    getDocument: {
      Endpoint: "/api/user/property/document/list",
      Method: HttpMethod.Get,
    },
    deleteDocument: {
      Endpoint: "/api/user/property/document/delete",
      Method: HttpMethod.Delete,
    },
  },
  Payment: {
    manualPaymentEntry: {
      Endpoint: "/api/user/property/payment/create",
      Method: HttpMethod.Post,
    },
    getReminderPayment: {
      Endpoint: "/api/user/property/payment/reminders",
      Method: HttpMethod.Post,
    },
    getReminderPayment: {
      Endpoint: "/api/user/property/payment/reminders",
      Method: HttpMethod.Get,
    },
    getPaymentHistoryForProperty: {
      Endpoint: "/api/user/property/payment/fetch",
      Method: HttpMethod.Get,
    },
    createPayment: {
      Endpoint: "api/user/property/payment/razorpay/create-order",
      Method: HttpMethod.Post,
    },
  },
  RatingAndRemoval: {
    initiateRemovalByOwner: {
      Endpoint: "/api/user/property/tenant-remove-request",
      Method: HttpMethod.Patch,
    },
    checkRemoveStatus: {
      Endpoint: "/api/user/property/check-remove-status",
      Method: HttpMethod.Get,
    },
     actionOnDeAssociationByTenant: {
      Endpoint: "/api/user/property/tenant-remove-action",
      Method: HttpMethod.Patch,
    },
    initiateRemovalByTenant: {
      Endpoint: "/api/user/property/tenant-leave-request",
      Method: HttpMethod.Post,
    },
     actionOnDeAssociationByOwner: {
      Endpoint: "/api/user/property/tenant-leave-action",
      Method: HttpMethod.Patch,
    },
  },

};

export default ApiRoutes;
