import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export default function configureStore () {
    const middlewares = [];
    middlewares.push(thunk);

    const NODE_ENV = `%NODE_ENV%`;
    if (NODE_ENV !== `production`) {
        middlewares.push(logger);
    }

    const persistConfig = {
        key: 'root',
        storage
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);
    return createStore(persistedReducer, applyMiddleware(...middlewares));
}