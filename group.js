const data = [];
let lastPubDate;
let firstScroll = 10000;
let groupIndex;

const startScrubGroup = () => {
  const getDataFromPost = (post) => {
    const groupName = document.querySelector(`${GROUP_NAME} a`).textContent;
    const groupImg = document.querySelector(GROUP_IMG).getAttribute("src");
    const postLink = post.querySelector(POST_LINK).getAttribute("href");
    let userImg = post.querySelector(USER_IMG);
    const userName = post.querySelector(`${USER_NAME} a`).getAttribute("title");
    const pubDate = post.querySelector(PUB_TIME).getAttribute("data-utime");
    let likes = post.querySelector(LIKES);
    let text = post.querySelector(TEXT_CONTENT);
    let somePic = post.querySelector(`${CUSTOM_CONTENT} img`);

    if (userImg) {
      userImg = userImg.getAttribute("src");
    } else {
      userImg = "";
    }

    if (text) {
      text = text.innerHTML;
    } else {
      text = "";
    }

    if (somePic) {
      somePic = somePic.getAttribute("src");
    } else {
      somePic = "";
    }

    if (likes) {
      likes = likes.textContent;
    } else {
      likes = "0";
    }
    data.push({
      groupName,
      groupImg,
      postLink,
      userImg,
      userName,
      pubDate,
      text,
      somePic,
      likes,
    });
  };

  const start = () => {
    const groupContainer = document.querySelector(POST_LIST);
    const nodeList = groupContainer.querySelectorAll(POST);
    const lastPubTimeINodeList =
      nodeList[nodeList.length - 1]
        .querySelector(PUB_TIME)
        .getAttribute("data-utime") * 1000;

    if (lastPubTimeINodeList >= lastPubDate) {
      window.scroll(0, firstScroll);

      firstScroll += 10000;

      setTimeout(() => {
        start();
      }, 1000);
    } else {
      [...nodeList].forEach((node) => {
        const postPubTime = node.querySelector(PUB_TIME)
          ? node.querySelector(PUB_TIME).getAttribute("data-utime") * 1000
          : 0;

        if (postPubTime >= lastPubDate) {
          getDataFromPost(node);
        }
      });

      chrome.runtime.sendMessage({
        message: "hello_save_this_please",
        data,
      });

      chrome.runtime.sendMessage({
        message: "open_group_tab",
        currentGroupIndex: groupIndex + 1,
      });

      chrome.runtime.sendMessage({
        message: "close_me",
      });
    }
  };

  chrome.runtime.sendMessage({
    message: "there_is_something_for_me",
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { message, index } = request;
    if (message === "i_have_set_time") {
      lastPubDate = request.setTime;
      groupIndex = index;
      start();
    }
  });
};
