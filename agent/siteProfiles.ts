export type SiteProfile = {
  name: string;
  match: (url: string) => boolean;

  searchInput?: string;

  resultLinks?: string;

  playButton?: string;

  video?: string;
};

export const siteProfiles: SiteProfile[] = [
  {
    name: "youtube",

    match: (url) => url.includes("youtube.com"),

    searchInput: "input#search",

    resultLinks: "ytd-video-renderer a#video-title",

    playButton: "button.ytp-play-button",

    video: "video",
  },

  {
    name: "wikipedia",

    match: (url) => url.includes("wikipedia.org"),

    searchInput: "input#searchInput",

    resultLinks: "div.mw-search-result-heading a",
  },

  {
    name: "brave",

    match: (url) => url.includes("brave.search.com"),

    searchInput: "input[name='q']",

    resultLinks: "a[data-testid='result-title-a']",
  },
];
