const startScrubGroupList = () => {
  let firstScroll = 10000;

  const getLinksOnGroup = () => {
    console.log("here");
    const groupLinks = [];
    const nodeList = document.querySelector(GROUP_LIST).children;
    [...nodeList].forEach((node) => {
      if (node.querySelector(ACTIVE_NOTIFICATION)) {
        const link = node.querySelector(GROUP_LINK).getAttribute("href");
        const regex = /\/\d*\//;
        const groupId = link.match(regex)[0];

        groupLinks.push(
          `${MAIN_LINK_DESKTOP}/groups${groupId}?sorting_setting=CHRONOLOGICAL`
        );
      }
    });

    chrome.runtime.sendMessage({
      message: "save_links_of_group",
      groupLinks,
    });

    chrome.runtime.sendMessage({
      message: "open_group_tab",
    });

    chrome.runtime.sendMessage({
      message: "close_me",
    });
  };

  const showMoreGroups = () => {
    const groupListContainer = document.querySelector(GROUP_LIST);
    const shoMoreIndicator = document.querySelector(SHOW_MORE);
    const loader = document.querySelector(LOADER);
    console.log(groupListContainer);

    if (shoMoreIndicator || loader) {
      window.scroll(0, firstScroll);
      firstScroll += 10000;
      setTimeout(() => {
        showMoreGroups();
      }, 1000);
    } else if (groupListContainer) {
      getLinksOnGroup();
    } else {
      setTimeout(() => {
        showMoreGroups();
      }, 1000);
    }
  };

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "go_scrub") {
      showMoreGroups();
    }
  });

  chrome.runtime.sendMessage({
    message: "hi_im_groups_page",
  });
};

window.onload = () => {
  const regex = /https:\/\/www\.facebook\.com\d*\/.*/;

  if (window.location.href === `${MAIN_LINK}/groups_browse/your_groups/`) {
    startScrubGroupList();
  } else if (regex.test(window.location.href)) {
    startScrubGroup();
  }
};
