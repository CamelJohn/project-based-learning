import { ProfileModelAttributes } from "../../database/models/types";
import { Contract } from "./types";

export function profileDomainToContract(
  profile: ProfileModelAttributes,
  following: boolean
): Contract {
  return {
    profile: {
      username: profile.username,
      bio: profile.bio,
      image: profile.image,
      following,
    },
  };
}
