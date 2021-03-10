export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Messages: undefined;
  HomeProfile: {
    userId: string;
  };
  Profile: undefined;
  AddPost: undefined;
  Chat: {
    userName: string;
    id: string;
    userImg: string;
  };
  AutoAuth: undefined;
  EditProfile: {
    firstName: string | undefined;
    lastName: string | undefined;
    bio: string | undefined;
    phone: string | undefined;
    photoUrl: string | undefined;
  };
};
