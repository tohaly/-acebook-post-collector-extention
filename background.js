const GROUP_PAGE = "https://m.facebook.com/groups_browse/your_groups/";

let setTime;
let newTabId;
let indexJsId;
let collectedData = []; // Saved post
let groupList; // List of group links
let index = 0; // Current active group index

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { message } = request;
  if (message === "open_new_tab") {
    const { date } = request;

    setTime = date;
    chrome.tabs.create(
      {
        url: GROUP_PAGE,
        active: true,
      },
      (tab) => {
        newTabId = tab.id;
      }
    );
  }

  if (message === "hi_im_groups_page") {
    chrome.tabs.sendMessage(newTabId, {
      message: "go_scrub",
    });
  }

  if (message === "save_links_of_group") {
    const { groupLinks } = request;
    groupList = groupLinks;
  }

  if (message === "open_group_tab") {
    const { currentGroupIndex } = request;
    index = currentGroupIndex ? currentGroupIndex : 0;

    if (index <= groupList.length - 1) {
      chrome.tabs.create({ url: groupList[index], active: true }, (tab) => {});
    } else {
      chrome.tabs.create({ url: "./index.html", active: true }, (tab) => {
        indexJsId = tab.id;
      });
    }
  }

  if (message === "hello_save_this_please") {
    const { data } = request;
    collectedData = collectedData.concat(data);
  }

  if (message === "there_is_something_for_me") {
    const { id } = sender.tab;
    chrome.tabs.sendMessage(id, {
      message: "i_have_set_time",
      setTime,
      index,
    });
  }

  if (message === "i_am_index_js_and_i_am_ready") {
    chrome.tabs.sendMessage(indexJsId, {
      message: "get_it_and_render",
      collectedData,
    });
  }

  if (message === "close_me") {
    const { id } = sender.tab;
    chrome.tabs.remove(id);
  }
});
