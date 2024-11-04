/*copy of the fuctions from the frontend - should be shared code*/
export const COMMON_PATHS = {
  CONFIRM_EMAIL: (userId: string = ":userId", code?: string) => {
    const params = new URLSearchParams();
    if (code) {
      params.append("code", code);
    }
    return `/confirm-email/${userId}${params.toString() ? `?${params.toString()}` : ""}`;
  },
  CONFIRM_CHANGE_EMAIL: (userId: string = ":userId", code?: string) => {
    const params = new URLSearchParams();
    if (code) {
      params.append("code", code);
    }
    return `/confirm-change-email/${userId}${params.toString() ? `?${params.toString()}` : ""}`;
  }
};
