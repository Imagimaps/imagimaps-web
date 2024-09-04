import { model } from '@modern-js/runtime/model';
import { Session } from '@shared/types/auth';
import { User } from '@shared/types/user';

type AuthModelState = {
  user?: User;
  session?: Session;
  isAuthenticated: boolean;
};

const AuthModelStateDefault: AuthModelState = {
  isAuthenticated: false,
};

export const AuthModel = model<AuthModelState>('user').define(_ => {
  return {
    state: AuthModelStateDefault,
    computed: {},
    actions: {
      setAuth: (state: AuthModelState, user: User, session: Session) => {
        state.user = user;
        state.session = session;
        state.isAuthenticated = true;
      },
      clearAuth: (state: AuthModelState) => {
        state.user = undefined;
        state.session = undefined;
        state.isAuthenticated = false;
      },
    },
  };
});
