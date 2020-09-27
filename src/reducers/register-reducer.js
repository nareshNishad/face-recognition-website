import { REGISTER_USER, CLEAR_DISPLAY } from "../actions";

export default (state = {}, action) => {
  console.log({ action });
  switch (action.type) {
    case REGISTER_USER:
      let finalData = {
        name: "",
        faceID: "",
      };
      finalData.name = action.payload.name;
      finalData.faceID = action.payload.img;
      return finalData;
    case CLEAR_DISPLAY:
      return {};
    default:
      return state;
  }
};
