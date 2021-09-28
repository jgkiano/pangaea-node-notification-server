export type AuthHeader = {
  authorization?: string;
};

export type AuthRequest = {
  headers: AuthHeader;
};

export type ApiKeyCreationRequest = {
  username?: string;
};
