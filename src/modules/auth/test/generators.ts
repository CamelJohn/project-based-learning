interface aUserLoginRequestArguments {
  email?: string;
  password?: string;
}

interface aUserRegisterRequestArguments {
  email?: string;
  password?: string;
  username?: string;
}

export function aMalformedUserRequest({
  email = "jonathan23986@gmail.com",
  password = "lies_liets",
}: aUserLoginRequestArguments) {
  return {
    user: {
      email,
    },
  };
}

export function aValidLoginUserRequest({
  email = "jonathan23986@gmail.com",
  password = "lies_liets",
}: aUserLoginRequestArguments) {
  return {
    user: {
      email,
      password,
    },
  };
}

export function aValidRegisterUserRequest({
  email = "jonathan23986@gmail.com",
  password = "lies_liets",
  username = 'jonathan'
}: aUserRegisterRequestArguments) {
  return {
    user: {
      email,
      password,
      username
    },
  };
}
