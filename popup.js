window.onload = () => {
  const inputContainerDate = document.querySelector(".input_date");
  const inputContainerTime = document.querySelector(".input_time");
  const button = document.querySelector(".start-button");

  const validate = (target) => {
    console.log(target.value);
    if (target.checkValidity()) {
      button.removeAttribute("disabled");
      return;
    } else {
      button.setAttribute("disabled", true);
    }
  };

  inputContainerDate.addEventListener("input", (event) => {
    validate(event.target);
  });

  inputContainerTime.addEventListener("input", (event) => {
    validate(event.target);
    console.log(event.target.value);
  });

  const parseTime = (time) => {
    const regexTime = /\d{2}/g;
    const regexGMT = /\+\d{4}/;
    const arrTime = time.match(regexTime);
    const GMT =
      Number(`${new Date()}`.match(regexGMT)[0].slice(1, -2)) * 3600000;
    console.log(GMT);
    return Number(arrTime[0]) * 3600000 + Number(arrTime[1]) * 60000 - GMT;
  };

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const inputDate = inputContainerDate.value;
    const inputTime = inputContainerTime.value;

    let date = Date.parse(inputDate) + parseTime(inputTime);
    console.log(Date.parse(inputDate), parseTime(inputTime), date);

    chrome.runtime.sendMessage({
      message: "open_new_tab",
      date,
    });
  });
};
