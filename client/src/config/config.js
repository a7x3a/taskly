const { VITE_API_URL ,LIST} = import.meta.env;

const config = {
  development: {
    API_URL: VITE_API_URL,
    LIST : LIST,
  },
};

export const getConfig = () => {
  return config.development;
};
