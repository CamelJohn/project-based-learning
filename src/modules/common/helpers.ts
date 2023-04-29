import { UserModelAttributes } from "../../database/models/types";
import { Contract } from "./types";

export function userDomainToContract(user: UserModelAttributes): Contract {
    return {
      user: {
        email: user.email,
        token: user.token,
        username: user?.profile?.username ?? "",
        bio: user?.profile?.bio ?? null,
        image: user?.profile?.image ?? null,
      },
    };
  }