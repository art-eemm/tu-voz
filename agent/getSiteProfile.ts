import { siteProfiles } from "./siteProfiles";

export function getSiteProfile(url: string) {
  for (const profile of siteProfiles) {
    if (profile.match(url)) {
      return profile;
    }
  }

  return null;
}
