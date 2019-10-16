import { combineReducers }      from 'redux';

import user     from './user'
import session from './session'

export default combineReducers({
    session,
    user
});

