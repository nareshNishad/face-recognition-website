export const REGISTER_USER = "register_user";

// function to register user
export function registerUser(data) {
  return {
    type: REGISTER_USER,
    payload: data,
  };
}
