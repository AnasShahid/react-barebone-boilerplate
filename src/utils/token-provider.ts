type GetTokenFn = () => Promise<string | null>;

let _getToken: GetTokenFn | null = null;

export const tokenProvider = {
  setGetToken: (fn: GetTokenFn) => {
    _getToken = fn;
  },
  getToken: (): Promise<string | null> => {
    if (_getToken) return _getToken();
    return Promise.resolve(null);
  },
};
