export type AuthHeader = {
  authorization?: string;
};

export type AuthRequest = {
  headers: AuthHeader;
};

export type ApiKeyCreationRequest = {
  username?: string;
};

export type GenerateApiKeySuccessResponse = {
  apiKey: string;
};

export type PublishToTopicSuccessResponse = {
  status: 'published' | 'error';
};

export type SubscriptionToTopicSuccessResponse = {
  url: string;
  topic: string;
};

export type SuccessPingResponse = {
  message: string;
};
