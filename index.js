const MAIN_LINK_DESKTOP = "https://www.facebook.com";

window.onload = () => {
  const template = document.querySelector("#template");
  const postList = document.querySelector(".post-list");

  chrome.runtime.sendMessage({
    message: "i_am_index_js_and_i_am_ready",
  });

  const sortPosts = (posts) => {
    return posts.sort((a, b) => {
      return b.pubDate - a.pubDate;
    });
  };

  const setPost = (data) => {
    const {
      groupName,
      groupImg,
      postLink,
      userImg,
      userName,
      pubDate,
      text,
      somePic,
      likes,
    } = data;
    const post = template.cloneNode(true).content;

    if (somePic) {
      post.querySelector(".post__img").setAttribute("src", somePic);
    } else {
      post.querySelector(".post__img").classList.add("hidden");
    }
    post.querySelector(".group_title").textContent = groupName;
    post.querySelector(".group_img").setAttribute("src", groupImg);
    post
      .querySelector(".post__link")
      .setAttribute("href", `${MAIN_LINK_DESKTOP}${postLink}`);
    post.querySelector(".post__user-img").setAttribute("src", userImg);
    post.querySelector(".post__user-name").textContent = userName;
    post.querySelector(".post__time").textContent = transformDate(pubDate);
    post.querySelector(".post__text").innerHTML = text;

    if (post.querySelector(".post__text").querySelector("._5z6m")) {
      post.querySelector(".post__text ._5z6m").classList.add("hidden");
    }

    if (+likes) {
      post.querySelector(".post__like-counter").textContent = likes;
    } else {
      post.querySelector(".post__like-container").classList.add("hidden");
    }

    postList.appendChild(post);
  };

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "get_it_and_render") {
      const { collectedData } = request;

      if (!collectedData.length) {
        const messageContainer = document.querySelector(".post-list__message");
        messageContainer.textContent =
          "Nothing found by the specified parameters";
        messageContainer.classList.remove("hidden");
      }

      sortPosts(collectedData).forEach((element) => {
        setPost(element);
      });
    }
  });

  const transformDate = (date) => {
    const newDate = new Date(Number(date * 1000));
    return newDate.toLocaleString("ru", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };
};
