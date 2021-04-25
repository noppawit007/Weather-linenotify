import { createStore, applyMiddleware } from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const middlewares = [thunk];
const middlewareEnhancer = applyMiddleware(...middlewares);
const enhancers = [middlewareEnhancer];
const composedEnhancers = composeWithDevTools(...enhancers);
const inisitalState = {};
const Store = createStore(reducers, inisitalState, composedEnhancers);

export default Store;
