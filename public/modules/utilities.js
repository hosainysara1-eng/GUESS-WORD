export const questions = [
  {
    hint: "زبان نشانه‌گذاری که برای ساختاردهی صفحات وب استفاده می‌شود",
    answer: "HTML",
    score: 1,
  },
  {
    hint: "زبانی که برای استایل‌دهی به صفحات وب استفاده می‌شود",
    answer: "CSS",
    score: 0.75,
  },
  {
    hint: "زبانی که باعث زنده شدن صفحات وب می‌شود",
    answer: "JAVASCRIPT",
    score: 1.75,
  },
  {
    hint: "لایبرری محبوب جاوااسکریپت برای ساخت رابط کاربری",
    answer: "REACT",
    score: 1.5,
  },
  {
    hint: "ابزاری برای مدیریت و نسخه‌بندی کدها",
    answer: "GIT",
    score: 0.5,
  },
  {
    hint: "زبان برنامه‌نویسی تایپ‌محور که روی جاوااسکریپت ساخته شده است",
    answer: "TYPESCRIPT",
    score: 1.25,
  },
  {
    hint: "سیستمی که برای طراحی ریسپانسیو استفاده می‌شود",
    answer: "BOOTSTRAP",
    score: 1,
  },
  {
    hint: "فرمت محبوب برای تصاویر وکتوری در وب",
    answer: "SVG",
    score: 0.75,
  },
  {
    hint: "ابزاری برای بسته‌بندی ماژول‌های جاوااسکریپت",
    answer: "WEBPACK",
    score: 1,
  },
  {
    hint: "سرویسی برای میزبانی کد و همکاری تیمی",
    answer: "GITHUB",
    score: 0.5,
  },
];

export const showToast = (toastText, isCorrect, continueBtn) => {
  const toastContainer = document.querySelector(".toast");
  const toastContent = document.querySelector(".toast-content");
  const proccessElem = document.querySelector(".process");

  let timeOfToast;
  let iconClass = isCorrect ? "fa-check-circle" : "fa-times-circle";

  toastContainer.classList.remove("hidden");
  continueBtn.classList.add("disabled");
  continueBtn.disabled = true;

  toastContent.innerHTML = "";

  toastContent.insertAdjacentHTML(
    "beforeend",
    `    
      <div class="toast-icon">
        <i class="fas ${iconClass}"></i>
      </div>
      <p class="toast-message">${toastText}</p>`,
  );

  const toastboxProgressBar = () => {
    clearInterval(timeOfToast);
    let time = 0;
    timeOfToast = setInterval(function () {
      time++;

      proccessElem.style.width = `${time}%`;
      if (time > 100) {
        clearInterval(timeOfToast);
        proccessElem.style.width = `0%`;
        toastContainer.classList.add("hidden");
        toastContainer.classList.remove("success");
        toastContainer.classList.remove("error");
        continueBtn.classList.remove("disabled");
        continueBtn.disabled = false;
      }
    }, 25);
  };

  if (isCorrect) {
    toastContainer.classList.add("success");

    toastboxProgressBar();
  } else {
    toastContainer.classList.add("error");

    toastboxProgressBar();
  }
};

export const showModal = (
  modalStatus,
  modalText,
  modalScreen,
  modalCard,
  modalIcon,
  modalContent,
) => {
  modalScreen.classList.remove("hidden");
  modalContent.innerHTML = modalText;

  if (modalStatus === "error") {
    modalCard.classList.add("error");
  } else if (modalStatus === "success") {
    modalCard.classList.add("success");
  }
};

export const closeModal = (modalScreen, modalCard) => {
  modalScreen.classList.add("hidden");
  modalCard.classList.remove("error");
  modalCard.classList.remove("success");
};
