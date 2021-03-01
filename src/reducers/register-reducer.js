import { REGISTER_USER } from "../actions";

export default (state = [], action) => {
  console.log("action", action);
  switch (action.type) {
    case REGISTER_USER:
      let finalData = [];
      let data = {
        name: "",
        faceID: "",
      };
      data.name = action.payload.name;
      data.faceID = action.payload.img;
      finalData.push(data);
      return finalData;
    default:
      return state;
  }
};
