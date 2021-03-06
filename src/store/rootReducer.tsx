import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";

import { notificationsReducer } from "@redhat-cloud-services/frontend-components-notifications/redux";
import { confirmDialogStateKey, confirmDialogReducer } from "./confirmDialog";

import {
  namespaceContextStateKey,
  namespaceContextReducer,
} from "./namespace-context";
import {
  deleteWithMatchModalStateKey,
  deleteWithMatchModalReducer,
} from "./delete-with-match-modal";

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  notifications: notificationsReducer,
  [confirmDialogStateKey]: confirmDialogReducer,
  [namespaceContextStateKey]: namespaceContextReducer,
  [deleteWithMatchModalStateKey]: deleteWithMatchModalReducer,
});
