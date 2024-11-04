export const ERRORS = {
  UNAUTHORIZED: {
    TOKEN_REVOKED: "jwt revoked",
    TOKEN_EXPIRED: "jwt expired",
    // WALLET_MISMACH: "Wallet address mismatch",
    NO_TOKEN1: "this resource requires a jwt token in the header",
    NO_TOKEN2:
      "we don't have access token, and it is an unknown error. possibly the accessToken was cut off?? or invalid json?"
  }
};
