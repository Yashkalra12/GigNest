export const INITIAL_STATE = {
  userId: "",
  title: "",
  category: "",
  cover: "",
  images: [],
  desc: "",
  shortTitle: "",
  shortDesc: "",
  deliveryTime: 0,
  revision: 0,
  features: [],
  price: 0,
};

export const GigReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };

    case "SET_CATEGORY":
      return {
        ...state,
        category: action.payload,
      };
    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };

    case "ADD_FEATURE":
      return {
        ...state,
        features: [...state.features, action.payload],
      };

    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter(
          (feature) => feature !== action.payload
        ),
      };
    case "SET_GIG":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
