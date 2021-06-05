import { useCallback, useReducer } from "react";
import { AxiosError, AxiosPromise } from "axios";
import { ActionType, createAsyncAction, getType } from "typesafe-actions";
import { debounce } from "lodash";

export const {
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure,
} = createAsyncAction(
  "useFetch/fetch/request",
  "useFetch/fetch/success",
  "useFetch/fetch/failure"
)<void, any, AxiosError>();

type State = Readonly<{
  isFetching: boolean;
  data?: any;
  fetchError?: AxiosError;
  fetchCount: number;
}>;

const defaultState: State = {
  isFetching: false,
  data: undefined,
  fetchError: undefined,
  fetchCount: 0,
};

type Action = ActionType<
  typeof fetchRequest | typeof fetchSuccess | typeof fetchFailure
>;

const initReducer = (isFetching: boolean): State => {
  return {
    ...defaultState,
    isFetching,
  };
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(fetchRequest):
      return {
        ...state,
        isFetching: true,
      };
    case getType(fetchSuccess):
      return {
        ...state,
        isFetching: false,
        fetchError: undefined,
        data: action.payload,
        fetchCount: state.fetchCount + 1,
      };
    case getType(fetchFailure):
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
        fetchCount: state.fetchCount + 1,
      };
    default:
      return state;
  }
};

export interface IArgs<T> {
  defaultIsFetching?: boolean;
  debounceWait?: number;
  onFetch: () => AxiosPromise<T>;
}

export interface IState<T> {
  data?: T;
  isFetching: boolean;
  fetchError?: AxiosError;
  fetchCount: number;
  requestFetch: () => void;
}

export const useFetch = <T>({
  defaultIsFetching = false,
  debounceWait,
  onFetch,
}: IArgs<T>): IState<T> => {
  const [state, dispatch] = useReducer(reducer, defaultIsFetching, initReducer);

  const fetchHandler = useCallback(() => {
    dispatch(fetchRequest());
    onFetch()
      .then(({ data }) => {
        dispatch(fetchSuccess(data));
      })
      .catch((error: AxiosError) => {
        dispatch(fetchFailure(error));
      });
  }, [onFetch]);

  // eslint-disable-next-line
  const fetchHandlerDebounce = useCallback(
    debounce(() => {
      dispatch(fetchRequest());
      onFetch()
        .then(({ data }) => {
          dispatch(fetchSuccess(data));
        })
        .catch((error: AxiosError) => {
          dispatch(fetchFailure(error));
        });
    }, debounceWait),
    [onFetch, debounceWait]
  );

  return {
    data: state.data,
    isFetching: state.isFetching,
    fetchError: state.fetchError,
    fetchCount: state.fetchCount,
    requestFetch: debounceWait ? fetchHandlerDebounce : fetchHandler,
  };
};

export default useFetch;
