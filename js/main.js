"use strict";

window.addEventListener("DOMContentLoaded", () => {
  // -------------------- Variables
  const hamburger = document.querySelector("#menuBtn");
  const mobileMenu = document.querySelector("#mobileMenu");
  const form = document.querySelector("#linkForm");
  const input = document.querySelector("#linkInput");
  const errorMsg = document.querySelector("#errorMessage");
  const result = document.querySelector("#shortenedLinks");

  // -------------------- Toggle Mobile Menu
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("flex");
    mobileMenu.classList.toggle("hidden");
  });

  // -------------------- Validate a URL
  function validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  }

  // -------------------- Form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputtedURL = input.value;

    // -------------------- Form: If input is empty or not a url
    if (inputtedURL === "") {
      errorMsg.innerText = "Please enter something";
      input.classList.add("border-red");
    } else if (!validURL(inputtedURL)) {
      errorMsg.innerText = "Please enter a valid URL";
      input.classList.add("border-red");
    } else {
      errorMsg.innerText = "Success";
      errorMsg.classList.remove("text-red");
      errorMsg.classList.add("text-cyan");
      input.classList.remove("border-red");
      input.classList.add("border-cyan");

      await shortenURL(inputtedURL);
    }
  });

  async function shortenURL(inputtedURL) {
    try {
      const res = await fetch(
        `https://tinyurl.com/api-create.php?url=${inputtedURL}`
      );
      const data = await res.text(); // Read the response as text

      const newShortenedURL = document.createElement("div");
      newShortenedURL.classList.add(
        "mb-5",
        "flex",
        "flex-col",
        "items-center",
        "justify-between",
        "w-full",
        "p-6",
        "bg-white",
        "rounded-lg",
        "md:flex-row"
      );

      // -------------------- Create shortened links in DOM
      newShortenedURL.innerHTML = `
        <p class="font-bold text-center text-veryDarkViolet md:text-left">
          ${inputtedURL}
        </p>

        <div class="flex flex-col items-center justify-end flex-1 space-x-4 space-y-2 md:flex-row md:space-y-0">
          <div class="font-bold text-cyan">${data}</div>
          <button class="copyLink p-2 px-8 text-white bg-cyan rounded-lg hover:bg-darkViolet focus:outline-none">
            Copy
          </button>
        </div>
      `;

      result.prepend(newShortenedURL);

      // -------------------- Copy link
      const copyButton = newShortenedURL.querySelector(".copyLink");
      copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(data);
        copyButton.classList.remove("bg-cyan");
        copyButton.classList.add("bg-darkViolet");
        copyButton.classList.remove("px-8");
        copyButton.classList.add("px-6");
        copyButton.innerText = "Copied!";
      });
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  }
});
