// ==UserScript==
// @name         HM Script2
// @namespace    http://tampermonkey.net/HM-script2
// @version      3.3.9
// @description  script made for filtering unique user IP matches also has minigames calculator. Shift + 0 is IP command, while Shift + 9 is for the minigames calc
// @author       Hristo Mangarudov
// @match        https://bo2.inplaynet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=upgaming.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        window.close
// @updateURL    https://raw.githubusercontent.com/hristomangarudov/hm_test_repo/refs/heads/main/HM%20Script.js
// @downloadURL  https://raw.githubusercontent.com/hristomangarudov/hm_test_repo/refs/heads/main/HM%20Script.js

// ==/UserScript==

(function () {
  "use strict";
  /* global $ */
  /* global Main */
  /* global EventEmitter */
  (function () {
    console.log("Diddler");
    let isSportClicked = false;
    window.addEventListener(
      "hashchange",
      () => {
        if (location.hash === "#sport" && !isSportClicked) {
          let el = document.querySelector(
            "section.user-sportsbook > div.collapsible.user-sportsbook-report> div.title-wrapper"
          )
            ? document.querySelector(
                "section.user-sportsbook > div.collapsible.user-sportsbook-report> div.title-wrapper"
              )
            : null;
          if (el) {
            el.click();
            isSportClicked = true;
          }
        }
      },
      false
    );
    const acceptWithdrawAcceptBtn = document.querySelector(
      'div.content > div.actions > div.btn.accept[text_key="ACCEPT"]'
    )
      ? document.querySelector(
          'div.content > div.actions > div.btn.accept[text_key="ACCEPT"]'
        )
      : "";
    const excelEl = document.querySelector(
      "section.collapsible.customer-requests.withdraw-requests > h3"
    )
      ? document.querySelector(
          "section.collapsible.customer-requests.withdraw-requests > h3"
        )
      : "";
    console.log(excelEl);
    if (excelEl) {
      let hidEl = document.createElement("div");
      let excelBtn = document.querySelector(
        "section.collapsible.customer-requests.withdraw-requests > h3 > div.export-to-excel"
      )
        ? document.querySelector(
            "section.collapsible.customer-requests.withdraw-requests > h3 > div.export-to-excel"
          )
        : "";
      hidEl.addEventListener("click", function name(params) {
        let annoyingLoader = document.querySelector(
          "section.collapsible.customer-requests.withdraw-requests > div.loader"
        )
          ? document.querySelector(
              "section.collapsible.customer-requests.withdraw-requests > div.loader"
            )
          : "";
        let transac = document.querySelector(
          "section.collapsible.customer-requests.withdraw-requests > div.grid-wrapper"
        )
          ? document.querySelector(
              "section.collapsible.customer-requests.withdraw-requests > div.grid-wrapper"
            )
          : "";
        if (annoyingLoader && transac) {
          let loadStyle = document.createElement("style");
          loadStyle.innerHTML = `
.hide-loader-forcefully {
  display: none !important;
}
.show-transac-forcefully {
  display: inline-grid !important;
}
`;
          document.head.appendChild(loadStyle);
          annoyingLoader.classList.add("hide-loader-forcefully");
          transac.classList.add("show-transac-forcefully");
          console.log("tasda");
          console.log(annoyingLoader);
          console.log(transac);
        }
      });
      hidEl.style.width = "20px";
      hidEl.style.height = "20px";
      //hidEl.style.background = "red"
      hidEl.style.display = "inline-grid";
      hidEl.style.margin = "auto 15px";
      if (!excelBtn) {
        hidEl.style.marginLeft = "auto";
      }
      hidEl.innerHTML = "-";
      event.preventDefault();
      excelEl.append(hidEl);
    }

    if (acceptWithdrawAcceptBtn) {
      acceptWithdrawAcceptBtn.style.position = "relative";
      acceptWithdrawAcceptBtn.style.zIndex = "2";
      acceptWithdrawAcceptBtn.style.left = "-100%";
      acceptWithdrawAcceptBtn.style.backgroundColor = "black";
      const currentFraudAgent = document.querySelector(
        "div.desktop-header-full-name > div.name"
      );
      if (
        currentFraudAgent &&
        currentFraudAgent.children[1].textContent == "FraudGJ"
      ) {
        acceptWithdrawAcceptBtn.style.display = "none";
      }
    } else {
      console.log("cant find it");
    }
  })();
  (function () {
    const commentParent = document.querySelector(".comment");

    if (!commentParent) {
      console.error(
        "Parent element with selector '.comment' not found. Cannot append checkboxes."
      );
      return;
    }

    const commentTextArea = commentParent.querySelector("textarea");
    if (!commentTextArea) {
      console.error("Textarea not found inside '.comment' element.");
      return;
    }

    const checkboxSectionWrapper = document.createElement("div");
    checkboxSectionWrapper.className = "mb-6";

    const checkboxesTitle = document.createElement("h3");
    checkboxesTitle.textContent = "Select Winnings Categories:";
    checkboxesTitle.className = "text-xl font-semibold text-gray-800 mb-4";
    checkboxSectionWrapper.appendChild(checkboxesTitle);

    const checkboxesContainer = document.createElement("div");
    checkboxesContainer.id = "dynamic-checkboxes-wrapper";
    checkboxesContainer.className =
      "flex flex-wrap gap-x-4 gap-y-2 items-center justify-start";
    checkboxesContainer.style.display = "flex";
    checkboxSectionWrapper.appendChild(checkboxesContainer);

    commentParent.insertBefore(checkboxSectionWrapper, commentTextArea);

    const gameCategories = ["Minigames", "Slots", "Live Casino", "Sportsbook"];

    function updateComment() {
      const selectedCategories = [];
      const checkboxes = checkboxesContainer.querySelectorAll(
        'input[type="checkbox"]'
      );

      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          selectedCategories.push(checkbox.value);
        }
      });

      let commentText = "";
      if (selectedCategories.length === 0) {
        commentText = "";
      } else if (selectedCategories.length === 1) {
        commentText = `winnings from ${selectedCategories[0].toLowerCase()}`;
      } else if (selectedCategories.length === 2) {
        commentText = `winnings from ${selectedCategories[0].toLowerCase()} and ${selectedCategories[1].toLowerCase()}`;
      } else {
        const lastCategory = selectedCategories.pop();
        const formattedCategories = selectedCategories
          .map((cat) => cat.toLowerCase())
          .join(", ");
        commentText = `winnings from ${formattedCategories} and ${lastCategory.toLowerCase()}`;
      }

      commentTextArea.value = commentText;
    }

    function resetCheckboxesAndComment() {
      const checkboxes = checkboxesContainer.querySelectorAll(
        'input[type="checkbox"]'
      );
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }

    gameCategories.forEach((category) => {
      const div = document.createElement("div");
      div.className = "flex items-center";
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.gap = "10px";
      div.style.margin = "10px";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `checkbox-${category.replace(/\s+/g, "-").toLowerCase()}`;
      checkbox.value = category;
      checkbox.className =
        "h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2";

      checkbox.addEventListener("change", updateComment);

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = category;
      label.className = "text-gray-700 text-base font-medium cursor-pointer";

      div.appendChild(checkbox);
      div.appendChild(label);
      checkboxesContainer.appendChild(div);
    });

    updateComment();

    const transactionInfoOverlay = document.querySelector(
      ".overlay.transaction-info"
    );

    if (transactionInfoOverlay) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class"
          ) {
            const isVisible =
              transactionInfoOverlay.classList.contains("visible");
            const wasVisible =
              mutation.oldValue && mutation.oldValue.includes("visible");

            if (isVisible && !wasVisible) {
              console.log(
                "Overlay became visible (via class change), resetting checkboxes and comment."
              );
              resetCheckboxesAndComment();
            }
          }
        });
      });

      observer.observe(transactionInfoOverlay, {
        attributes: true,
        attributeFilter: ["class"],
        attributeOldValue: true,
      });

      const initialIsVisible =
        transactionInfoOverlay.classList.contains("visible");
      if (initialIsVisible) {
        console.log(
          "Overlay initially visible (via class check), resetting checkboxes and comment."
        );
        resetCheckboxesAndComment();
      }
    } else {
      console.warn(
        "Element with class '.overlay.transaction-info' not found. Reset functionality will not be active."
      );
    }
  })();
  function getCurrentShiftRangeEncoded() {
    const now = new Date();
    const hour = now.getHours();

    let start, end, shiftType;

    if (hour >= 8 && hour < 20) {
      shiftType = "day";
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        8,
        0,
        0
      );
      end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        20,
        0,
        0
      );
    } else if (hour >= 20) {
      shiftType = "night";
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        20,
        0,
        0
      );
      end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        8,
        0,
        0
      );
    } else {
      shiftType = "night";
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
        20,
        0,
        0
      );
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
    }

    start.setHours(start.getHours() - 3);
    end.setHours(end.getHours() - 3);

    function formatDate(date) {
      const pad = (num) => num.toString().padStart(2, "0");
      return `${pad(date.getDate())}-${pad(
        date.getMonth() + 1
      )}-${date.getFullYear()} ${pad(date.getHours())}:${pad(
        date.getMinutes()
      )}`;
    }

    const fromStr = formatDate(start);
    const toStr = formatDate(end);

    const shiftDate = `${start.getFullYear()}-${String(
      start.getMonth() + 1
    ).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
    const shiftId = `${shiftDate}_${shiftType}`;

    return {
      from: convertAndEncodeDate(fromStr),
      to: convertAndEncodeDate(toStr),
      shiftId,
    };
  }
  async function fetchTransactionsForCurrentShift(admin) {
    const seniors = ["FraudHM", "FraudkvBG", "FraudPB", "FraudMT", "FraudBGaa"];

    if (!seniors.includes(admin)) {
      return;
    }
    // if (admin != "FraudHM") {
    //   return;
    // }
    const defaultInterval = 1.5 * 60 * 60 * 1000; // 1h 30m
    const fastInterval = 0.5 * 60 * 60 * 1000; // 30m

    const { from, to, shiftId } = getCurrentShiftRangeEncoded();
    cleanupOldShiftTracking(shiftId);
    const lastCheckKey = `lastShiftCheckTime_${shiftId}`;
    const intervalKey = `shiftCheckInterval_${shiftId}`;

    const lastCheck = parseInt(localStorage.getItem(lastCheckKey) || "0");
    const interval = parseInt(
      localStorage.getItem(intervalKey) || defaultInterval.toString()
    );
    const now = Date.now();

    if (now - lastCheck < interval) {
      console.log("Too soon to run again");
      return;
    }
    const lastShownShift = localStorage.getItem("lastShift250Triggered");

    if (lastShownShift === shiftId) return;
    const pageSize = 100;
    let page = 1;
    let allTransactions = [];

    try {
      let maxPages = 5;
      while (page <= maxPages) {
        const response = await fetch(
          `https://bo2.inplaynet.com/api/Customer/GetSystemTransaction?CurrentPage=${page}&PageSize=${pageSize}&OrderColumn=transactionId&OrderDirection=desc&StartDate=${from.encodedStandard}&ToDate=${to.encodedStandard}&AdminName=${admin}&Brands%5B0%5D=1&Brands%5B1%5D=3&Brands%5B2%5D=5&Brands%5B3%5D=10&Brands%5B4%5D=12&Brands%5B5%5D=16&Brands%5B6%5D=17&Brands%5B7%5D=22&Brands%5B8%5D=23&Brands%5B9%5D=31&Brands%5B10%5D=35&Brands%5B11%5D=36&Brands%5B12%5D=40&Brands%5B13%5D=42&Brands%5B14%5D=43&Brands%5B15%5D=49&Brands%5B16%5D=50&Brands%5B17%5D=55&Brands%5B18%5D=59&Brands%5B19%5D=61&Brands%5B20%5D=68&Brands%5B21%5D=74&Brands%5B22%5D=75&Brands%5B23%5D=79&Brands%5B24%5D=80&Brands%5B25%5D=83&Brands%5B26%5D=84&Brands%5B27%5D=85&Brands%5B28%5D=86&Brands%5B29%5D=92&Brands%5B30%5D=93&OperationTypes%5B0%5D=2`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              "Accept-Encoding": "gzip, deflate, br, zstd",
              "Accept-Language": "en-US,en;q=0.9",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-Fetch-Site": "same-origin",
              "X-Requested-With": "XMLHttpRequest",
            },
            referrer:
              "https://bo2.inplaynet.com/html/systemTransaction/systemTransaction.html",
            referrerPolicy: "strict-origin-when-cross-origin",
            mode: "cors",
            credentials: "include",
          }
        );

        if (!response.ok) {
          const lastShownShift = localStorage.getItem("lastShift250Triggered");
          localStorage.setItem("lastShift250Triggered", shiftId);
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const transactions = Array.isArray(data) ? data : data?.result || [];

        if (!transactions.length) break;

        allTransactions = allTransactions.concat(transactions);

        if (transactions.length < pageSize) break;

        page++;
      }

      checkShiftThresholdAndNotify(allTransactions, shiftId);
      console.log(allTransactions);
      localStorage.setItem(lastCheckKey, Date.now().toString());

      if (allTransactions.length >= 200) {
        localStorage.setItem(intervalKey, fastInterval.toString());
      } else {
        localStorage.setItem(intervalKey, defaultInterval.toString());
      }
      return allTransactions;
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      return [];
    }
  }
  function checkShiftThresholdAndNotify(transactions, shiftId) {
    const lastShownShift = localStorage.getItem("lastShift250Triggered");

    if (lastShownShift === shiftId) return;

    if (transactions.length > 250) {
      localStorage.setItem("lastShift250Triggered", shiftId);
      showDeMotivationalModal();
    }
  }
  function cleanupOldShiftTracking(currentShiftId) {
    for (let key in localStorage) {
      if (
        key.startsWith("lastShiftCheckTime_") ||
        key.startsWith("shiftCheckInterval_")
      ) {
        if (!key.includes(currentShiftId)) {
          localStorage.removeItem(key);
        }
      }
    }
    const lastShownShift = localStorage.getItem("lastShift250Triggered");
    if (lastShownShift && lastShownShift !== currentShiftId) {
      localStorage.removeItem("lastShift250Triggered");
    }
  }
  function showDeMotivationalModal() {
    const motivationalGifs = [
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHFyc3o1cTNucTh3bXo1a3lqbzRheWRhejNnMDc0ZjB4NXB0bjJnNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vX9WcCiWwUF7G/giphy.gif",
      "https://i1.sndcdn.com/avatars-000623888460-ygj39m-t1080x1080.jpg",
      "https://preview.redd.it/nm93snupy1i31.jpg?auto=webp&s=0c9751a8e9164d26931acf795bc2653754273ef9",
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTFyNmV1NTM4empmNmE4dTh5MHg3NTRkZXAydzYyYWg0aDFlZjV2eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/F3BeiZNq6VbDwyxzxF/giphy.gif",
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTBrcTE2ZTZibHlmMm44Nm14anEwZWIyZWxkem5henBvb2I3Yzc1YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/relnvfSEa2Qa125uPA/giphy.gif",
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWd2c3V1ZWIyZDd1d3djNHF5NHRyeGZwb3RidHR3MnZpc2U5ZjNseSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ToMjGpx9F5ktZw8qPUQ/giphy.gif",
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjBhMDV3cGIybzJmc2FzcWRkd2c3dGF0NTZrazF3ZTd2ZDV4aTk5cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4Ki2obCyAQS5WhFe/giphy.gif",
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2Y2cGRhd3Y2bnZtbmpiOWpqZDNvbGU1Mm1scndoNnd4MHhwdzd4byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2K5jinAlChoCLS/giphy.gif",
    ];
    const gifUrl =
      motivationalGifs[Math.floor(Math.random() * motivationalGifs.length)];
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(0,0,0,0.7)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "999999";

    modal.innerHTML = `
    <div style="background:white; padding:30px; border-radius:10px; text-align:center;">
      <h2 style="font-size:24px;">250+?Nqkoi prekalqva...</h2>
      <img src="${gifUrl}" style="width:400px; maxHeight:400px;" />
    </div>
  `;

    modal.addEventListener("click", () => modal.remove());
    document.body.appendChild(modal);
  }

  let skipCurrentMonth = true; //IMPORTANT FOR POD

  function functionalityChecker() {
    let href = window.location.href.includes("#comments");
    let isTransactionsContainerVisible;
    let transactionsContainer = document.querySelector(
      ".overlay.transaction-info"
    );
    if (!transactionsContainer) {
      console.log("no container found");
    } else {
      isTransactionsContainerVisible =
        transactionsContainer.classList.contains("visible");
    }
    return !(
      (href && !isTransactionsContainerVisible) ||
      isTransactionsContainerVisible
    );
  }
  function selectUserID() {
    const spanElement = document.querySelector(".user-info > .user > span");
    return spanElement ? spanElement.textContent : "";
  }

  function convertAndEncodeDate(dateStr) {
    if (!dateStr) return { encodedStandard: "", encodedCustom: "" };
    const dateParts = dateStr.split(" ");
    const datePart = dateParts[0].split("-");
    const timePart = dateParts[1];
    const standardDate = `${datePart[2]}-${datePart[1]}-${datePart[0]} ${timePart}`;
    const encodedStandard = encodeURIComponent(standardDate);
    const encodedCustom = encodeURIComponent(dateStr);
    return { encodedStandard, encodedCustom };
  }

  function selectInputDatesByName() {
    const startDtInput = document.querySelector(
      'input[name="TransactionStartDt"]'
    );
    const toDtInput = document.querySelector('input[name="TransactionToDt"]');
    const startDt = startDtInput ? startDtInput.value : "";
    const toDt = toDtInput ? toDtInput.value : "";
    const convertedStartDt = convertAndEncodeDate(startDt);
    const convertedToDt = convertAndEncodeDate(toDt);
    return { startDt: convertedStartDt, toDt: convertedToDt };
  }

  function miniGamesCalc(data) {
    console.log(data);

    const gamesWithMultiplier = ["MiniGames[Type1]", "MiniGames[Type2]"];
    const gamesWithoutMultiplier = [
      "MiniGames[Plinko]",
      "MiniGames[Frog]",
      "MiniGames[Keno 40]",
      "LambdaGaming[8BITPlinko]",
      "MiniGames[Penalty]",
      "MiniGames[Roulette]",
    ];

    const modalOverlay = document.createElement("div");
    modalOverlay.style.cssText =
      "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 100000; display: flex; justify-content: center; align-items: center;";

    const modalDialog = document.createElement("div");
    modalDialog.style.cssText =
      "background-color: #fff; border-radius: 5px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); max-width: 80%; max-height: 80%; overflow: auto;";

    const modalContent = document.createElement("div");
    modalContent.style.cssText = "padding: 20px;";

    modalContent.innerHTML = `
        <p>Count: ${data.count}</p>
        <p>Sum Bet: ${data.sumBet}</p>
        <p><b>Sum Deposit: ${data.sumDeposit}</b></p>
        <p>Sum Withdraw: ${data.sumWithdraw}</p>
    `;

    const relevantTransactions = data.transactions;

    let wageredSum = 0;

    for (let i = relevantTransactions.length - 1; i >= 0; i--) {
      const currentTransaction = relevantTransactions[i];

      if (currentTransaction.operationTypeName === "Win") {
        continue;
      } else if (currentTransaction.operationTypeName === "Bet") {
        if (gamesWithoutMultiplier.includes(currentTransaction.accountName)) {
          wageredSum += currentTransaction.localAmount;
        } else if (
          gamesWithMultiplier.includes(currentTransaction.accountName) ||
          currentTransaction.accountName.startsWith("MiniGames") ||
          currentTransaction.gameTypeName === "MiniGames"
        ) {
          if (
            i > 0 &&
            relevantTransactions[i - 1].operationTypeName === "Win"
          ) {
            const nextTransaction = relevantTransactions[i - 1];
            console.log(
              nextTransaction.localAmount / currentTransaction.localAmount,
              (
                nextTransaction.localAmount / currentTransaction.localAmount
              ).toFixed(2)
            );
            if (
              (
                nextTransaction.localAmount / currentTransaction.localAmount
              ).toFixed(2) >= 1.3
            ) {
              wageredSum += currentTransaction.localAmount;
            }
          } else {
            wageredSum += currentTransaction.localAmount;
          }
        }
      }
    }
    modalContent.innerHTML += `<p><b>Wagered Sum: ${wageredSum}</b></p>`;

    modalDialog.appendChild(modalContent);
    modalOverlay.appendChild(modalDialog);

    modalOverlay.addEventListener("click", function (event) {
      if (event.target === modalOverlay) {
        modalOverlay.remove();
      }
    });

    document.body.appendChild(modalOverlay);
  }

  async function fetchAllTransactions(userID, startDt, toDt, totalPages) {
    let allTransactions = [];
    let totalBetAmount = 0;
    let totalDepositAmount = 0;
    let totalWithdrawalAmount = 0;

    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(
        `https://bo2.inplaynet.com/api/customer/searchcustomertransactions?UserProfileId=${userID}&CurrentPage=${page}&PageSize=500&TransactionId=&TransactionGuid=&GameId=&TransactionStartDt=${startDt.encodedCustom}&TransactionToDt=${toDt.encodedCustom}&AmountFrom=&AmountTo=&RequiresManualConfirmation=&GameOperationOnly=0&StartDate=${startDt.encodedStandard}&ToDate=${toDt.encodedStandard}&SearchCurrency=`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      allTransactions = allTransactions.concat(data.transactions);

      data.transactions.forEach((transaction) => {
        if (transaction.operationTypeName === "Bet") {
          totalBetAmount += transaction.localAmount;
        } else if (transaction.operationTypeName === "Deposit") {
          totalDepositAmount += transaction.localAmount;
        } else if (transaction.operationTypeName === "Withdrawal") {
          totalWithdrawalAmount += transaction.localAmount;
        }
      });
    }

    return {
      transactions: allTransactions,
      totalBetAmount: totalBetAmount,
      totalDepositAmount: totalDepositAmount,
      totalWithdrawalAmount: totalWithdrawalAmount,
    };
  }
  async function fetchAllTransactions2(userID, startDt, toDt, totalPages) {
    let allTransactions = [];
    let totalBetAmount = 0;
    let totalDepositAmount = 0;
    let totalWithdrawalAmount = 0;

    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(
        `https://bo2.inplaynet.com/api/customer/searchcustomertransactions?UserProfileId=${userID}&CurrentPage=${page}&PageSize=500&TransactionId=&TransactionGuid=&GameId=&TransactionStartDt=&TransactionToDt=&AmountFrom=&AmountTo=&RequiresManualConfirmation=&GameOperationOnly=1&StartDate=&ToDate=&SearchCurrency=`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      allTransactions = allTransactions.concat(data.transactions);

      data.transactions.forEach((transaction) => {
        if (transaction.operationTypeName === "Bet") {
          totalBetAmount += transaction.localAmount;
        } else if (transaction.operationTypeName === "Deposit") {
          totalDepositAmount += transaction.localAmount;
        } else if (transaction.operationTypeName === "Withdrawal") {
          totalWithdrawalAmount += transaction.localAmount;
        }
      });
    }

    return {
      transactions: allTransactions,
      totalBetAmount: totalBetAmount,
      totalDepositAmount: totalDepositAmount,
      totalWithdrawalAmount: totalWithdrawalAmount,
    };
  }
  function showLoader() {
    const loader = document.createElement("div");
    loader.innerHTML =
      '<p style="color: red;"><b>Calculating Minigames...</b></p>';
    loader.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(255, 255, 255, 1);
        border: 1px solid #f00;
        padding: 20px;
        z-index: 100001;
    `;
    document.body.appendChild(loader);
    return loader;
  }

  function removeLoader(loader) {
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }
  function freeSpinUserChecker(transactions) {
    if (!transactions || transactions.length === 0) {
      console.warn("No transactions found.");
      return;
    }

    const oldestTransaction = transactions.reduce((oldest, current) =>
      new Date(oldest.orderDate) < new Date(current.orderDate)
        ? oldest
        : current
    );

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let oldUser = false;
    let newUser = false;

    if (new Date(oldestTransaction.orderDate) < sixMonthsAgo) {
      oldUser = true;
    } else {
      newUser = true;
    }

    const latestDeposits = transactions
      .filter((transaction) => transaction.operationTypeName === "Deposit")
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 5);
    if (latestDeposits.length === 0) {
      console.warn("No deposit transactions found.");
      return;
    }

    const totalAmount = latestDeposits.reduce(
      (sum, transaction) => sum + transaction.localAmount,
      0
    );
    const averageAmount = totalAmount / latestDeposits.length;

    let freeSpins = 0;
    if (newUser) {
      if (averageAmount > 0 && averageAmount <= 50) freeSpins = 100;
      else if (averageAmount > 50 && averageAmount <= 100) freeSpins = 200;
      else if (averageAmount > 100 && averageAmount <= 500) freeSpins = 500;
      else if (averageAmount > 500) freeSpins = 1000;
    } else if (oldUser) {
      if (averageAmount > 0 && averageAmount <= 50) freeSpins = 300;
      else if (averageAmount > 50 && averageAmount <= 100) freeSpins = 500;
      else if (averageAmount > 100 && averageAmount <= 500) freeSpins = 1000;
      else if (averageAmount > 500) freeSpins = 2000;
    }

    const modal = document.createElement("div");
    modal.className = "free-spin-modal";
    modal.innerHTML = `
        <div class="modal-content">
            <p>User Type:<b> ${oldUser ? "Old User" : "New User"}</b></p>
            <p>Average Amount: <b> ${averageAmount}</b></p>
            <p>Maximum Free Spins Withdraw Amount:<b> ${freeSpins} </b></p>
        </div>
    `;
    document.body.appendChild(modal);

    const style = document.createElement("style");
    style.innerHTML = `
        .free-spin-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-family: Arial, sans-serif;
        }
        .modal-content {
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    const closeModal = (event) => {
      if (!modal.contains(event.target)) {
        modal.remove();
        style.remove();
        document.removeEventListener("click", closeModal);
      }
    };
    document.addEventListener("click", closeModal);
  }
  async function CopyCards(ev) {
    const currentDate = new Date();
    const userEl = document.querySelector(
      "body > main > div.content-wrapper > div.user-info > div.user > span"
    );
    if (!userEl) return false;
    const userdataid = userEl.innerText.trim();

    const res = await fetch(
      "https://bo2.inplaynet.com/api/customer/GetCardPan?UserProfileId=" +
        userdataid
    );
    const fssdata = await res.json();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const validCards = (Array.isArray(fssdata) ? fssdata : []).filter(
      (item) => {
        if (!item || item.cardStatus !== 3) return false;
        const dt = new Date(item.createDateMax);
        if (Number.isNaN(dt.getTime())) return false;
        return dt >= sixMonthsAgo;
      }
    );

    if (!validCards.length) return false;

    const x = ev?.pageX ?? window.innerWidth / 2;
    const y = ev?.pageY ?? window.innerHeight / 2;

    const existing = document.getElementById("cardModal");
    if (existing) existing.remove();

    const cardModal = document.createElement("div");
    cardModal.id = "cardModal";
    Object.assign(cardModal.style, {
      position: "absolute",
      top: y + 10 + "px",
      left: x + 10 + "px",
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,.15)",
      padding: "10px",
      zIndex: "99999",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      fontFamily: "system-ui, sans-serif",
      fontSize: "14px",
    });

    function maskPan(pan) {
      const s = String(pan || "");
      if (s.length <= 8) return s;
      return s.slice(0, 6) + "X".repeat(s.length - 8) + s.slice(-2);
    }

    function makeBtn(label, formatter) {
      const btn = document.createElement("button");
      const preview = formatter(validCards[0].cardPan);
      btn.textContent = `${label} (e.g. ${preview})`;
      Object.assign(btn.style, {
        padding: "8px 16px",
        border: "none",
        borderRadius: "4px",
        background: "#28a745",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        textAlign: "center",
      });
      btn.onmouseenter = () => (btn.style.background = "#218838");
      btn.onmouseleave = () => (btn.style.background = "#28a745");
      btn.onclick = async () => {
        const text =
          validCards.map((c) => formatter(String(c.cardPan))).join(", ") +
          " requested";
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
          }
        } finally {
          cardModal.remove();
          document.removeEventListener("click", outsideHandler);
        }
      };
      return btn;
    }

    cardModal.appendChild(makeBtn("Last Two", maskPan));
    cardModal.appendChild(makeBtn("Last Four", (p) => p));
    document.body.appendChild(cardModal);

    function outsideHandler(e) {
      if (!cardModal.contains(e.target)) {
        cardModal.remove();
        document.removeEventListener("click", outsideHandler);
      }
    }
    setTimeout(() => document.addEventListener("click", outsideHandler), 0);

    return true;
  }
  async function ipchecker() {
    function applyStyles(element, styles) {
      for (const property in styles) {
        element.style[property] = styles[property];
      }
    }

    const modal = document.createElement("div");
    modal.id = "ipCheckerModal";
    applyStyles(modal, {
      display: "none",
      position: "fixed",
      zIndex: "1000",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      overflow: "auto",
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingTop: "60px",
      animation: "fadeIn 0.3s ease-out",
    });

    const modalContent = document.createElement("div");
    applyStyles(modalContent, {
      backgroundColor: "#ffffff",
      margin: "5% auto",
      padding: "30px",
      borderRadius: "8px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25), 0 6px 10px rgba(0,0,0,0.1)",
      width: "90%",
      maxWidth: "1000px",
      animation: "slideInTop 0.4s ease-out",
    });

    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.className = "close-button";
    applyStyles(closeBtn, {
      color: "#aaaaaa",
      float: "right",
      fontSize: "32px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "color 0.3s ease",
    });

    // Function to close the modal and clean up listeners
    const closeModal = () => {
      modal.style.display = "none";
      document.body.style.overflow = "";
      modal.remove(); // Remove the modal from the DOM
      document.removeEventListener("keydown", handleEscapeKey); // Remove escape key listener
    };

    closeBtn.onclick = closeModal;
    closeBtn.onmouseover = () => (closeBtn.style.color = "#333333");
    closeBtn.onmouseout = () => (closeBtn.style.color = "#aaaaaa");

    const modalHeader = document.createElement("h2");
    modalHeader.textContent = "IP Checker Results";
    applyStyles(modalHeader, {
      textAlign: "left",
      color: "#333333",
      fontSize: "2em",
      marginBottom: "25px",
      borderBottom: "1px solid #eeeeee",
      paddingBottom: "15px",
    });

    const loader = document.createElement("div");
    loader.id = "modalLoader";
    loader.textContent = "Loading data...";
    applyStyles(loader, {
      textAlign: "center",
      padding: "30px",
      fontSize: "1.2em",
      color: "#666666",
      fontStyle: "italic",
    });

    const tableContainer = document.createElement("div");
    applyStyles(tableContainer, {
      overflowX: "auto",
    });

    const table = document.createElement("table");
    table.id = "SysTrans";
    applyStyles(table, {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
      marginTop: "25px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      borderRadius: "8px",
      overflow: "hidden",
    });

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(loader);
    modalContent.appendChild(tableContainer);
    tableContainer.appendChild(table);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    if (!document.getElementById("modalAnimationsStyle")) {
      const styleTag = document.createElement("style");
      styleTag.id = "modalAnimationsStyle";
      styleTag.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideInTop {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .close-button:hover {
                color: #333333 !important;
                text-decoration: none;
            }
        `;
      document.head.appendChild(styleTag);
    }

    // Add event listener for clicking outside the modal content
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        // If the click target is the modal background itself
        closeModal();
      }
    });

    // Add event listener for Escape key press
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        // event.key is more modern
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);

    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    // String.prototype.replaceAt polyfill (if not globally available)
    if (!String.prototype.replaceAt) {
      String.prototype.replaceAt = function (index, replacement) {
        return (
          this.substring(0, index) +
          replacement +
          this.substring(index + replacement.length)
        );
      };
    }

    try {
      const usermyidElement = document.querySelector(
        "body > main > div.content-wrapper > div.user-info > div.user > span"
      );
      if (!usermyidElement) {
        throw new Error("User ID element not found at the specified DOM path.");
      }
      const usermyid = usermyidElement.innerHTML;

      const response = await fetch(
        "https://bo2.inplaynet.com/api/Customer/FilterNormalizedIps?UserProfileId=" +
          usermyid +
          "&FilterDuplicates=true&PageSize=100&CurrentPage=1"
      );
      const list = await response.json();

      const tbody = document.createElement("tbody");
      table.appendChild(tbody);

      const headerRow = document.createElement("tr");
      const headers = [
        "User ID",
        "User Name",
        "IP",
        "Group",
        "Agent",
        "NGR",
        "Last Use",
      ];
      headers.forEach((text, index) => {
        const th = document.createElement("th");
        th.textContent = text;
        applyStyles(th, {
          padding: "12px 15px",
          textAlign: "left",
          borderBottom: "1px solid #eeeeee",
          backgroundColor: "#f7f7f7",
          color: "#555555",
          fontWeight: "bold",
          textTransform: "uppercase",
          fontSize: "0.9em",
          letterSpacing: "0.5px",
        });
        if (index === 0) {
          th.style.borderTopLeftRadius = "8px";
        }
        if (index === headers.length - 1) {
          th.style.borderTopRightRadius = "8px";
        }
        headerRow.appendChild(th);
      });
      tbody.appendChild(headerRow);

      const columnStyles = [
        { width: "10%", minWidth: "80px" },
        { width: "12%", minWidth: "100px" },
        { width: "12%", minWidth: "120px" },
        { width: "10%", minWidth: "80px" },
        { width: "35%", minWidth: "250px", wordBreak: "break-word" },
        { width: "8%", minWidth: "60px" },
        { width: "13%", minWidth: "130px" },
      ];

      Array.from(headerRow.children).forEach((th, index) => {
        applyStyles(th, columnStyles[index]);
      });

      if (list.length === 0) {
        const noDataRow = document.createElement("tr");
        const noDataCell = document.createElement("td");
        noDataCell.textContent = "No duplicate IPs found.";
        noDataCell.colSpan = 7;
        applyStyles(noDataCell, {
          textAlign: "center",
          padding: "20px",
          color: "#888",
          fontStyle: "italic",
        });
        noDataRow.appendChild(noDataCell);
        tbody.appendChild(noDataRow);
        loader.style.display = "none";
        return;
      }

      const calcthisp = list.length;
      for (let i = 0; i < list.length; i++) {
        if (list[i].othersCount > 0) {
          const saveip = list[i].ip;
          const savedevice = list[i].userAgent;

          const responsef = await fetch(
            "https://bo2.inplaynet.com/api/Customer/FilterDuplicateIpUsers?userProfileId=" +
              usermyid +
              "&ipAddress=" +
              saveip +
              "&currentPage=1&pageSize=100"
          );
          const listf = await responsef.json();

          for (let g = 0; g < listf.length; g++) {
            if (savedevice === listf[g].userAgent) {
              let nadate = listf[g].lastUseDate.replaceAt(10, " ");

              const grpname =
                listf[g].groups === null ? "No Group" : listf[g].groups;

              const dataRow = document.createElement("tr");
              if ((i + g) % 2 === 0) {
                applyStyles(dataRow, { backgroundColor: "#fdfdfd" });
              }
              dataRow.onmouseover = () =>
                applyStyles(dataRow, {
                  backgroundColor: "#f0f8ff",
                  transition: "background-color 0.2s ease",
                });
              dataRow.onmouseout = () =>
                applyStyles(dataRow, {
                  backgroundColor:
                    (i + g) % 2 === 0 ? "#fdfdfd" : "transparent",
                  transition: "background-color 0.2s ease",
                });

              const userIdCell = document.createElement("td");
              const userIdLink = document.createElement("a");
              userIdLink.href = `https://bo2.inplaynet.com/html/users/userpage.html?cid=${listf[g].userProfileId}#dashboard`;
              userIdLink.target = "_blank";
              userIdLink.textContent = listf[g].userProfileId;
              applyStyles(userIdLink, {
                color: "#007bff",
                textDecoration: "none",
                transition: "color 0.2s ease",
              });
              userIdLink.onmouseover = () =>
                (userIdLink.style.color = "#0056b3");
              userIdLink.onmouseout = () =>
                (userIdLink.style.color = "#007bff");
              userIdCell.appendChild(userIdLink);
              dataRow.appendChild(userIdCell);

              const userNameCell = document.createElement("td");
              userNameCell.textContent = listf[g].userName;
              dataRow.appendChild(userNameCell);

              const ipCell = document.createElement("td");
              ipCell.textContent = listf[g].ip;
              dataRow.appendChild(ipCell);

              const groupCell = document.createElement("td");
              groupCell.textContent = grpname;
              dataRow.appendChild(groupCell);

              const agentCell = document.createElement("td");
              agentCell.textContent = listf[g].userAgent;
              dataRow.appendChild(agentCell);

              const ngrCell = document.createElement("td");
              ngrCell.textContent = listf[g].ngrBrandAmount;
              dataRow.appendChild(ngrCell);

              const lastUseCell = document.createElement("td");
              lastUseCell.textContent = nadate;
              dataRow.appendChild(lastUseCell);

              Array.from(dataRow.children).forEach((td, idx) => {
                applyStyles(td, {
                  padding: "12px 15px",
                  textAlign: "left",
                  borderBottom: "1px solid #eeeeee",
                });
                if (columnStyles[idx]) {
                  applyStyles(td, columnStyles[idx]);
                }
              });

              tbody.appendChild(dataRow);
            }
          }
        }
        const tempload = i + 1;
        loader.textContent = `Loaded ${tempload} of ${calcthisp}`;
        if (tempload === calcthisp) {
          loader.style.display = "none";
        }
      }
    } catch (error) {
      console.error("Error in ipchecker:", error);
      loader.textContent = "Error loading data. Please try again.";
      loader.style.color = "red";
    }
  }
  async function handleKeyPress(event) {
    if (functionalityChecker()) {
      const currentAdmin = document.querySelector(
        "div.desktop-header-full-name > div.name"
      )
        ? document.querySelectorAll(
            "div.desktop-header-full-name > div.name >span"
          )[1]?.textContent
        : "FraudHM";
      console.log(currentAdmin);
      const loader = showLoader();
      const currentUserID = selectUserID();
      if (event.shiftKey && event.keyCode === 49 && currentUserID) {
        console.log("Diddler");
        ipchecker();
      } else if (event.shiftKey && event.keyCode === 48 && currentUserID) {
        CopyCards();
      } else if (event.keyCode === 192 && currentUserID) {
        loadmode();
      } else if (event.shiftKey && event.keyCode === 57) {
        // Shift + 9 for minigames calculator
        const transactions = await fetchTransactionsForCurrentShift(
          currentAdmin
        );
        const { startDt, toDt } = selectInputDatesByName();
        let totalPages = 1;

        const spanPageElement = document.querySelector(
          "tfoot.pagination tr td > div.wrapper > ul.nums > li:last-child > span"
        );
        if (spanPageElement) {
          totalPages = parseInt(spanPageElement.textContent, 10);
          console.log("Total pages:", totalPages);
        }

        if (currentUserID) {
          try {
            const {
              transactions,
              totalBetAmount,
              totalDepositAmount,
              totalWithdrawalAmount,
            } = await fetchAllTransactions(
              currentUserID,
              startDt,
              toDt,
              totalPages
            );
            const data = {
              transactions: transactions,
              count: transactions.length,
              sumBet: totalBetAmount,
              sumDeposit: totalDepositAmount,
              sumWithdraw: totalWithdrawalAmount,
            };
            miniGamesCalc(data);
          } catch (error) {
            console.error("Error fetching transactions:", error);
          }
        } else {
          console.log("User ID not found.");
        }
      } else if (event.shiftKey && event.keyCode === 56) {
        // Shift + 8 for custom filtered transactions
        const transactions = await fetchTransactionsForCurrentShift(
          currentAdmin
        );
        const { startDt, toDt } = selectInputDatesByName();
        const currentUserID = selectUserID();
        let totalPages = 1;

        const spanPageElement = document.querySelector(
          "tfoot.pagination tr td > div.wrapper > ul.nums > li:last-child > span"
        );
        if (spanPageElement) {
          totalPages = parseInt(spanPageElement.textContent, 10);
          console.log("Total pages:", totalPages);
        }

        if (currentUserID) {
          try {
            const { transactions } = await fetchAllTransactions2(
              currentUserID,
              startDt,
              toDt,
              totalPages
            );

            customTransactionFilter(transactions);
          } catch (error) {
            console.error("Error fetching transactions:", error);
          }
        } else {
          console.log("User ID not found.");
        }
      } else if (event.shiftKey && event.keyCode === 55 && currentUserID) {
        // Shift + 7 for free spin user check
        const { startDt, toDt } = selectInputDatesByName();
        const currentUserID = selectUserID();
        let totalPages = 1;

        const spanPageElement = document.querySelector(
          "tfoot.pagination tr td > div.wrapper > ul.nums > li:last-child > span"
        );
        if (spanPageElement) {
          totalPages = parseInt(spanPageElement.textContent, 10);
          console.log("Total pages:", totalPages);
        }

        if (currentUserID) {
          try {
            const { transactions } = await fetchAllTransactions2(
              currentUserID,
              startDt,
              toDt,
              totalPages
            );

            freeSpinUserChecker(transactions);
          } catch (error) {
            console.error("Error fetching transactions:", error);
          }
        } else {
          console.log("User ID not found.");
        }
      } else if (event.shiftKey && event.keyCode === 189 && currentUserID) {
      }
      removeLoader(loader);
    }
  }

  function customTransactionFilter(transactions) {
    console.log("filter1");
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const previousDates = new Date();
    previousDates.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 0);

    const threeMonthsAgo = new Date(previousDates);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const oneMonthsAgo = new Date(previousDates);
    oneMonthsAgo.setMonth(oneMonthsAgo.getMonth() - 1);
    const sixMonthsAgo = new Date(previousDates);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let totalSum = 0;
    let threeMonthSum = 0;
    let oneMonthSum = 0;
    let sixMonthSum = 0;
    let isEUR = false;
    let isUSD = false;

    let latestValidTransaction = { Noda: null, Payopp: null };
    const transactionsByMonth = {};

    const transactionTypesAll = new Set();
    const transactionTypesSixMonths = new Set();
    const transactionTypesThreeMonths = new Set();
    const transactionTypesOneMonth = new Set();

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.orderDate);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();

      if (skipCurrentMonth) {
        if (
          (transaction.accountName.includes("Payop") ||
            transaction.accountName.includes("Noda")) &&
          transaction.operationTypeName !== "Withdraw"
        ) {
          totalSum += transaction.localAmount;

          const monthKey = `${transactionYear}-${transactionMonth}`;
          if (!transactionsByMonth[monthKey])
            transactionsByMonth[monthKey] = { Noda: 0, Payopp: 0 };

          if (transaction.accountName.includes("Payop")) {
            transactionsByMonth[monthKey].Payopp++;
            transactionTypesAll.add("Payop");
          }
          if (transaction.accountName.includes("Noda")) {
            transactionsByMonth[monthKey].Noda++;
            transactionTypesAll.add("Noda");
          }

          if (
            transaction.localCurrencyCode === "EUR" ||
            transaction.localCurrencyCode === "USD"
          ) {
            isEUR = true;
            isUSD = true;
          }

          if (transactionDate >= sixMonthsAgo && transactionDate <= today) {
            sixMonthSum += transaction.localAmount;
            if (transaction.accountName.includes("Payop"))
              transactionTypesSixMonths.add("Payop");
            if (transaction.accountName.includes("Noda"))
              transactionTypesSixMonths.add("Noda");
          }

          if (transactionDate >= threeMonthsAgo && transactionDate <= today) {
            threeMonthSum += transaction.localAmount;
            if (transaction.accountName.includes("Payop"))
              transactionTypesThreeMonths.add("Payop");
            if (transaction.accountName.includes("Noda"))
              transactionTypesThreeMonths.add("Noda");
          }

          if (transactionDate >= oneMonthsAgo && transactionDate <= today) {
            oneMonthSum += transaction.localAmount;
            if (transaction.accountName.includes("Payop"))
              transactionTypesOneMonth.add("Payop");
            if (transaction.accountName.includes("Noda"))
              transactionTypesOneMonth.add("Noda");
          }
          if (
            skipCurrentMonth &&
            transactionMonth === currentMonth &&
            transactionYear === currentYear
          ) {
            return;
          }

          if (
            transaction.accountName.includes("Payop") &&
            (!latestValidTransaction.Payopp ||
              transactionDate > latestValidTransaction.Payopp)
          ) {
            latestValidTransaction.Payopp = transactionDate;
          }
          if (
            transaction.accountName.includes("Noda") &&
            (!latestValidTransaction.Noda ||
              transactionDate > latestValidTransaction.Noda)
          ) {
            latestValidTransaction.Noda = transactionDate;
          }
        }
      } else {
        if (
          skipCurrentMonth &&
          transactionMonth === currentMonth &&
          transactionYear === currentYear
        ) {
          return;
        }
        if (
          (transaction.accountName.includes("Payop") ||
            transaction.accountName.includes("Noda")) &&
          transaction.operationTypeName !== "Withdraw"
        ) {
          totalSum += transaction.localAmount;

          const monthKey = `${transactionYear}-${transactionMonth}`;
          if (!transactionsByMonth[monthKey])
            transactionsByMonth[monthKey] = { Noda: 0, Payopp: 0 };

          if (transaction.accountName.includes("Payop")) {
            transactionsByMonth[monthKey].Payopp++;
            transactionTypesAll.add("Payop");
          }
          if (transaction.accountName.includes("Noda")) {
            transactionsByMonth[monthKey].Noda++;
            transactionTypesAll.add("Noda");
          }

          if (
            transaction.localCurrencyCode === "EUR" ||
            transaction.localCurrencyCode === "USD"
          ) {
            isEUR = true;
            isUSD = true;
          }

          if (transactionDate >= sixMonthsAgo && transactionDate <= today) {
            sixMonthSum += transaction.localAmount;
            if (transaction.accountName.includes("Payop"))
              transactionTypesSixMonths.add("Payop");
            if (transaction.accountName.includes("Noda"))
              transactionTypesSixMonths.add("Noda");
          }

          if (transactionDate >= threeMonthsAgo && transactionDate <= today) {
            threeMonthSum += transaction.localAmount;
            if (transaction.accountName.includes("Payop"))
              transactionTypesThreeMonths.add("Payop");
            if (transaction.accountName.includes("Noda"))
              transactionTypesThreeMonths.add("Noda");
          }

          if (transactionDate >= oneMonthsAgo && transactionDate <= today) {
            oneMonthSum += transaction.localAmount;
            if (transaction.accountName.includes("Payop"))
              transactionTypesOneMonth.add("Payop");
            if (transaction.accountName.includes("Noda"))
              transactionTypesOneMonth.add("Noda");
          }

          if (
            transaction.accountName.includes("Payop") &&
            (!latestValidTransaction.Payopp ||
              transactionDate > latestValidTransaction.Payopp)
          ) {
            latestValidTransaction.Payopp = transactionDate;
          }
          if (
            transaction.accountName.includes("Noda") &&
            (!latestValidTransaction.Noda ||
              transactionDate > latestValidTransaction.Noda)
          ) {
            latestValidTransaction.Noda = transactionDate;
          }
        }
      }
    });

    const getMonthName = (date) =>
      date.toLocaleString("default", { month: "long" });

    const handlePodRequest = (
      transactionSet,
      sumCheck,
      typeString,
      latestTransaction
    ) => {
      console.log(latestTransaction);
      if (latestTransaction) {
        console.log(latestTransaction);
        if (latestTransaction) {
          console.log(latestTransaction);
          const transactionMonthKey = `${latestTransaction.getFullYear()}-${latestTransaction.getMonth()}`;
          const monthName = getMonthName(latestTransaction);
          const transactionsInMonth = transactionsByMonth[transactionMonthKey];

          if (transactionsInMonth) {
            let transactionTypes = [];
            let transactionCount = 0;
            let transactionNoda = 0;
            let transactionPayopp = 0;

            if (transactionsInMonth.Noda > 0) {
              transactionCount += transactionsInMonth.Noda;
              transactionNoda += transactionsInMonth.Noda;
              transactionTypes.push("Noda");
            }

            if (transactionsInMonth.Payopp > 0) {
              transactionCount += transactionsInMonth.Payopp;
              transactionPayopp += transactionsInMonth.Payopp;
              transactionTypes.push("Payopp");
            }

            return `<pre>PoD requested for ${monthName} (${transactionTypes.join(
              " and "
            )})     |     Count:${transactionCount} (N:${transactionNoda} P:${transactionPayopp})</pre>`;
          }
        }
      }
      return "";
    };

    let podRequestText = "";

    const latestTransaction =
      latestValidTransaction.Noda && latestValidTransaction.Payopp
        ? latestValidTransaction.Noda > latestValidTransaction.Payopp
          ? latestValidTransaction.Noda
          : latestValidTransaction.Payopp
        : latestValidTransaction.Noda || latestValidTransaction.Payopp;

    if (sixMonthSum >= 10000 && threeMonthSum > 0 && oneMonthSum > 0) {
      podRequestText = handlePodRequest(
        transactionTypesOneMonth,
        oneMonthSum,
        Array.from(transactionTypesOneMonth).join(" and "),
        latestTransaction
      );
    } else if (sixMonthSum >= 10000 && threeMonthSum > 0 && oneMonthSum === 0) {
      podRequestText = handlePodRequest(
        transactionTypesThreeMonths,
        threeMonthSum,
        Array.from(transactionTypesThreeMonths).join(" and "),
        latestTransaction
      );
    } else if (sixMonthSum >= 10000 && threeMonthSum === 0) {
      podRequestText = handlePodRequest(
        transactionTypesSixMonths,
        sixMonthSum,
        Array.from(transactionTypesSixMonths).join(" and "),
        latestTransaction
      );
    }

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.style.cssText =
      "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 100000; display: flex; justify-content: center; align-items: center;";

    const modalDialog = document.createElement("div");
    modalDialog.style.cssText =
      "background-color: #fff; border-radius: 5px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); max-width: 50%; padding: 20px; display:flex; flex-direction: column ";

    if (isEUR || isUSD) {
      modalDialog.innerHTML = `
            <h3>Nope. EUR/USD. No PoD required for EUR/USD transactions</h3>
            <img src="https://media1.tenor.com/m/WUmceUdDbW4AAAAd/tom-and-jerry-slap.gif" alt="Transaction Summary" style="width: 100%; height: auto;">
        `;
    } else {
      modalDialog.innerHTML = `
            <button type="button" id="ignoreCurrentMonthBtn" class="btn accept accept-items" display="block" onClick="changeMonthSkip()">${
              skipCurrentMonth ? "Include Current Month" : "Skip Current Month"
            }</button>
            <h3>Transaction Summary</h3>
            <p>Total Sum of All Filtered Transactions: <b>${totalSum.toFixed(
              2
            )}</b> (${Array.from(transactionTypesAll).join(" and ")})</p>
            <p>Total Sum of All Filtered Transactions in the <b>last 6 Months: ${sixMonthSum.toFixed(
              2
            )}</b> (${Array.from(transactionTypesSixMonths).join(" and ")})</p>
            <p>Total Sum of All Filtered Transactions in the <b>last 3 Months: ${threeMonthSum.toFixed(
              2
            )}</b> (${Array.from(transactionTypesThreeMonths).join(
        " and "
      )})</p>
            <p>Total Sum of All Filtered Transactions in the <b>last Month: ${oneMonthSum.toFixed(
              2
            )}</b> (${Array.from(transactionTypesOneMonth).join(" and ")})</p>
            <hr>
            <p><strong>${podRequestText}</strong></p>
        `;
      const button = modalDialog.querySelector("#ignoreCurrentMonthBtn");
      button.addEventListener("click", changeMonthSkip);
    }

    modalOverlay.appendChild(modalDialog);

    modalOverlay.addEventListener("click", function (event) {
      if (event.target === modalOverlay) {
        modalOverlay.remove();
      }
    });

    document.body.appendChild(modalOverlay);
  }

  function changeMonthSkip() {
    const existingOverlays = document.querySelectorAll(".modal-overlay");
    existingOverlays.forEach((overlay) => overlay.remove());
    skipCurrentMonth = !skipCurrentMonth;
    console.log(`skipCurrentMonth is now: ${skipCurrentMonth}`);
    runChangeMonthSkipLogic();
  }

  async function runChangeMonthSkipLogic() {
    const loader = showLoader();
    try {
      const { startDt, toDt } = selectInputDatesByName();
      const currentUserID = selectUserID();
      let totalPages = 1;

      const spanPageElement = document.querySelector(
        "tfoot.pagination tr td > div.wrapper > ul.nums > li:last-child > span"
      );
      if (spanPageElement) {
        totalPages = parseInt(spanPageElement.textContent, 10);
        console.log("Total pages:", totalPages);
      }

      if (currentUserID) {
        const { transactions } = await fetchAllTransactions2(
          currentUserID,
          startDt,
          toDt,
          totalPages
        );
        customTransactionFilter(transactions);
      } else {
        alert("User ID not found.");
      }
    } catch (error) {
      console.error("Error in runChangeMonthSkipLogic:", error);
    }
    removeLoader(loader);
  }
  (function insertImageWithAnimatedBorder(containerSelector, imageUrl) {
    const currentFraudAgent = document.querySelector(
      "div.desktop-header-full-name > div.name"
    );
    const container = document.querySelector(
      "nav.sidebar > div.content-wrapper"
    );
    const imgURL =
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/defab05d-48e2-49f8-9e6c-74b3434b61a2/d6se8de-d10f089b-5b9c-40fa-b919-42a2a37f4781.png";
    const imgStitchURL =
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnE4MHB3anIxc2M3ZDh2MWU1c3E4NmEzZnNoZ2R4bzFrY2NrcjB0NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/L9YGSZcBdi2yQrU69K/giphy.gif";
    if (currentFraudAgent) {
      if (currentFraudAgent.children[1]) {
        console.log(currentFraudAgent.children[1].textContent);
        if (currentFraudAgent.children[1].textContent === "FraudHM") {
          if (container) {
            const img = document.createElement("img");
            img.src = imgURL;
            img.alt = "Decorative Image";
            img.style.width = "95%";
            img.style.display = "block";
            img.style.margin = "10px auto";

            img.style.position = "relative";
            img.style.border = "4px solid transparent";
            img.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.9)";
            img.style.animation = "border-anim 4s linear infinite";

            const style = document.createElement("style");
            style.textContent = `
      @keyframes border-anim {
        0% {
          border-color: #ff6f61;
        }
        25% {
          border-color: #ffc107;
        }
        50% {
          border-color: #28a745;
        }
        75% {
          border-color: #17a2b8;
        }
        100% {
          border-color: #ff6f61;
        }
      }
    `;
            document.head.appendChild(style);
            const backgroundEl1 = document.querySelector(
              "nav.sidebar> div.content-wrapper"
            );
            const backgroundEl2 = document.querySelector(
              "nav.sidebar> div.content-wrapper > a.logo-url"
            );
            const backgroundEl3 = document.querySelector("header");
            const backgroundEl4 = document.querySelector(
              "main >div.content-wrapper"
            );

            backgroundEl4.style.background =
              "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/12/Zoldyck-Family.jpg)";
            backgroundEl4.style.backgroundSize = "cover";
            backgroundEl4.style.backgroundPosition = "center";

            backgroundEl1.style.backgroundImage =
              "linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )";
            backgroundEl2.style.backgroundImage =
              "linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )";
            backgroundEl3.style.backgroundImage =
              "linear-gradient( 271deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )";
            const zenoImg = document.createElement("img");
            zenoImg.src =
              "https://d1m9vqlvl3fy94.cloudfront.net/role/attachment/745511/default_239257download1.jpeg";
            zenoImg.style.width = "50px";
            zenoImg.style.height = "50px";
            const fraudSpan = document.querySelector(
              "div.desktop-header-full-name> div.name"
            );
            const firstFraudSpanChild = fraudSpan.childNodes[0];
            if (firstFraudSpanChild) {
              fraudSpan.insertBefore(zenoImg, firstFraudSpanChild);
              firstFraudSpanChild.style.display = "none";
            }

            const secondChild = container.childNodes[1];
            if (secondChild) {
              container.insertBefore(img, secondChild);
            }
          } else {
            console.error(`Container not found: ${containerSelector}`);
          }
        } else if (currentFraudAgent.children[1].textContent === "FraudMK") {
          const backgroundEl1 = document.querySelector(
            "nav.sidebar> div.content-wrapper"
          );
          const backgroundEl2 = document.querySelector(
            "nav.sidebar> div.content-wrapper > a.logo-url"
          );
          const backgroundEl3 = document.querySelector("header");
          backgroundEl1.style.backgroundImage =
            "linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)";
          backgroundEl2.style.backgroundImage =
            "linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)";
          backgroundEl3.style.backgroundImage =
            "linear-gradient(271deg, #c6ffdd, #fbd786, #f7797d)";
        } else if (currentFraudAgent.children[1].textContent === "FraudkvBG") {
          const backgroundEl1 = document.querySelector(
            "nav.sidebar> div.content-wrapper"
          );
          const backgroundEl2 = document.querySelector(
            "nav.sidebar> div.content-wrapper > a.logo-url"
          );
          const backgroundEl3 = document.querySelector("header");
          if (container) {
            const img = document.createElement("img");
            img.src =
              "https://1000logos.net/wp-content/uploads/2017/04/Logo-Liverpool.png";
            img.alt = "Decorative Image";
            img.style.width = "95%";
            img.style.display = "block";
            img.style.margin = "10px auto";
            img.style.maxHeight = "250px";

            img.style.position = "relative";
            img.style.border = "4px solid transparent";

            img.style.animation = "border-anim 4s linear infinite";

            const style = document.createElement("style");
            style.textContent = `
          border-color: #ff6f61;
    `;
            document.head.appendChild(style);
            const backgroundEl1 = document.querySelector(
              "nav.sidebar> div.content-wrapper"
            );
            const backgroundEl2 = document.querySelector(
              "nav.sidebar> div.content-wrapper > a.logo-url"
            );
            const backgroundEl3 = document.querySelector("header");
            backgroundEl1.style.backgroundColor = "rgba(255,177,153,1)";
            backgroundEl2.style.backgroundColor = "rgba(255,177,153,1)";
            backgroundEl3.style.backgroundColor = "rgba(255,177,153,1)";
            const zenoImg = document.createElement("img");
            zenoImg.src = "https://app.skin.land/market_images/35648_s.png";
            zenoImg.style.width = "50px";
            zenoImg.style.height = "50px";
            const fraudSpan = document.querySelector(
              "div.desktop-header-full-name> div.name"
            );
            const firstFraudSpanChild = fraudSpan.childNodes[0];
            if (firstFraudSpanChild) {
              fraudSpan.insertBefore(zenoImg, firstFraudSpanChild);
              firstFraudSpanChild.style.display = "none";
            }

            const secondChild = container.childNodes[1];
            if (secondChild) {
              container.insertBefore(img, secondChild);
            }
          } else {
            console.error(`Container not found: ${containerSelector}`);
          }
        } else if (currentFraudAgent.children[1].textContent === "FraudPB") {
          if (container) {
            const img = document.createElement("img");
            img.src =
              "https://www.symbols.com/images/symbol/3292_world-of-warcraft-horde-logo.png";
            img.alt = "Decorative Image";
            img.style.width = "85%";
            img.style.maxHeight = "20em";
            img.style.display = "block";
            img.style.margin = "10px auto";

            img.style.position = "relative";
            img.style.border = "4px solid transparent";
            img.style.animation = "border-anim 4s linear infinite";

            const style = document.createElement("style");

            document.head.appendChild(style);
            const backgroundEl1 = document.querySelector(
              "nav.sidebar> div.content-wrapper"
            );
            const backgroundEl2 = document.querySelector(
              "nav.sidebar> div.content-wrapper > a.logo-url"
            );
            const backgroundEl3 = document.querySelector("header");
            backgroundEl1.style.backgroundImage =
              "linear-gradient(to right, rgb(237, 33, 58), rgb(147, 41, 30))";
            backgroundEl2.style.backgroundImage =
              "linear-gradient(to right, rgb(237, 33, 58), rgb(147, 41, 30))";
            backgroundEl3.style.backgroundImage =
              "linear-gradient(271deg, rgb(237, 33, 58), rgb(147, 41, 30))";
            backgroundEl3.style.color = "white";
            backgroundEl3.querySelectorAll("*").forEach((child) => {
              child.style.color = "white";
            });
            const brandsSelect = document.querySelector(
              "header>div.search-brand"
            );
            brandsSelect.style.color = "#5f5f5f";
            brandsSelect.querySelectorAll("*").forEach((child) => {
              child.style.color = "#5f5f5f";
            });
            const zenoImg = document.createElement("img");
            zenoImg.src =
              "https://img.rankedboost.com/wp-content/uploads/2019/05/WoW-Classic-Warlock-Guide.png";
            zenoImg.style.width = "50px";
            zenoImg.style.height = "50px";
            const fraudSpan = document.querySelector(
              "div.desktop-header-full-name> div.name"
            );
            const firstFraudSpanChild = fraudSpan.childNodes[0];
            if (firstFraudSpanChild) {
              fraudSpan.insertBefore(zenoImg, firstFraudSpanChild);
              firstFraudSpanChild.style.display = "none";
            }

            const secondChild = container.childNodes[1];
            if (secondChild) {
              container.insertBefore(img, secondChild);
            }
          } else {
            console.error(`Container not found: ${containerSelector}`);
          }
        } else if (currentFraudAgent.children[1].textContent === "FraudBGaa") {
          if (container) {
            const img = document.createElement("img");
            img.src = imgStitchURL;
            img.alt = "Decorative Image";
            img.style.width = "95%";
            img.style.display = "block";
            img.style.margin = "10px auto";
            img.style.maxHeight = "250px";

            img.style.position = "relative";
            img.style.border = "4px solid transparent";

            img.style.animation = "border-anim 4s linear infinite";

            const style = document.createElement("style");
            style.textContent = `
          border-color: #ff6f61;
    `;
            document.head.appendChild(style);
            const backgroundEl1 = document.querySelector(
              "nav.sidebar> div.content-wrapper"
            );
            const backgroundEl2 = document.querySelector(
              "nav.sidebar> div.content-wrapper > a.logo-url"
            );
            const backgroundEl3 = document.querySelector("header");
            backgroundEl1.style.backgroundImage =
              "linear-gradient(257deg, rgba(48,181,255,0.9808298319327731) 11%, rgba(38,243,255,1) 62%)";

            backgroundEl2.style.backgroundImage =
              "linear-gradient(257deg, rgba(48,181,255,0.9808298319327731) 11%, rgba(48,181,255,1) 62%)";

            backgroundEl3.style.backgroundImage =
              "linear-gradient(90deg, rgba(48,181,255,0.9808298319327731) 11%, rgba(38,243,255,1) 62%)";
            const zenoImg = document.createElement("img");
            zenoImg.src =
              "https://seeklogo.com/images/L/lilo-stitch-logo-42959E729E-seeklogo.com.png";
            zenoImg.style.width = "50px";
            zenoImg.style.height = "50px";
            const fraudSpan = document.querySelector(
              "div.desktop-header-full-name> div.name"
            );
            const firstFraudSpanChild = fraudSpan.childNodes[0];
            if (firstFraudSpanChild) {
              fraudSpan.insertBefore(zenoImg, firstFraudSpanChild);
              firstFraudSpanChild.style.display = "none";
            }

            const secondChild = container.childNodes[1];
            if (secondChild) {
              container.insertBefore(img, secondChild);
            }
          } else {
            console.error(`Container not found: ${containerSelector}`);
          }
        }
      } else {
        console.log("nema nikoi");
      }
    }
  })();
  async function getBrander() {
    try {
      const brandElement = document.querySelector(".user > .brand");
      if (!brandElement || !brandElement.textContent) {
        console.warn(
          "Brand element '.user > .brand' not found or has no text content."
        );
        return null;
      }
      const userBrandName = brandElement.textContent.toLowerCase();

      const response = await fetch(
        "https://bo2.inplaynet.com/api/profile/GetProfile"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.brands && Array.isArray(data.brands)) {
        for (const brand of data.brands) {
          if (
            brand.brandName &&
            brand.brandName.toLowerCase() === userBrandName
          ) {
            return brand.brandID;
          }
        }
      }

      console.warn(`Brand ID not found for brand name: ${userBrandName}`);
      return null;
    } catch (error) {
      console.error("Error in getBrander function:", error);
      return null;
    }
  }

  async function loadmode() {
    function applyStyles(element, styles) {
      for (const property in styles) {
        element.style[property] = styles[property];
      }
    }

    const modal = document.createElement("div");
    modal.id = "transactionModal";
    applyStyles(modal, {
      display: "none",
      position: "fixed",
      zIndex: "1000",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      overflow: "auto",
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingTop: "60px",
      animation: "fadeIn 0.3s ease-out",
    });

    const modalContent = document.createElement("div");
    applyStyles(modalContent, {
      backgroundColor: "#ffffff",
      margin: "5% auto",
      padding: "30px",
      borderRadius: "8px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25), 0 6px 10px rgba(0,0,0,0.1)",
      width: "90%",
      maxWidth: "1300px",
      animation: "slideInTop 0.4s ease-out",
    });

    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.className = "close-button";
    applyStyles(closeBtn, {
      color: "#aaaaaa",
      float: "right",
      fontSize: "32px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "color 0.3s ease",
    });

    // Define the closeModal function
    const closeModal = () => {
      modal.style.display = "none";
      document.body.style.overflow = ""; // Restore scrolling
      modal.remove(); // Remove the modal from the DOM
      document.removeEventListener("keydown", handleEscapeKey); // Clean up Escape key listener
    };

    closeBtn.onclick = closeModal; // Assign closeModal to the close button
    closeBtn.onmouseover = () => (closeBtn.style.color = "#333333");
    closeBtn.onmouseout = () => (closeBtn.style.color = "#aaaaaa");

    const modalHeader = document.createElement("h2");
    modalHeader.textContent = "System Transactions";
    applyStyles(modalHeader, {
      textAlign: "left",
      color: "#333333",
      fontSize: "2em",
      marginBottom: "25px",
      borderBottom: "1px solid #eeeeee",
      paddingBottom: "15px",
    });

    const loader = document.createElement("div");
    loader.id = "modalLoader";
    loader.textContent = "Loading transactions...";
    applyStyles(loader, {
      textAlign: "center",
      padding: "30px",
      fontSize: "1.2em",
      color: "#666666",
      fontStyle: "italic",
    });

    const tableContainer = document.createElement("div");
    applyStyles(tableContainer, {
      overflowX: "auto",
    });

    const table = document.createElement("table");
    table.id = "SysTransTable";
    applyStyles(table, {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
      marginTop: "25px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      borderRadius: "8px",
      overflow: "hidden",
    });

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(loader);
    modalContent.appendChild(tableContainer);
    tableContainer.appendChild(table);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    if (!document.getElementById("modalAnimationsStyle")) {
      const styleTag = document.createElement("style");
      styleTag.id = "modalAnimationsStyle";
      styleTag.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideInTop {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .close-button:hover {
                color: #333333 !important;
                text-decoration: none;
            }
        `;
      document.head.appendChild(styleTag);
    }

    // Add event listener for clicking outside the modal content
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        // Check if the click occurred directly on the modal background
        closeModal();
      }
    });

    // Define the Escape key handler
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        // event.key is more modern, keyCode for wider compatibility
        closeModal();
      }
    };
    // Add event listener for Escape key press
    document.addEventListener("keydown", handleEscapeKey);

    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    try {
      const usermyidElement = document.querySelector(
        "body > main > div.content-wrapper > div.user-info > div.user > span"
      );
      if (!usermyidElement) {
        throw new Error("User ID element not found at the specified DOM path.");
      }
      const usermyid = usermyidElement.innerHTML;

      const branderValue = await getBrander();
      if (branderValue === null) {
        loader.textContent =
          "Error: Could not retrieve brand ID. Ensure an element with class '.user > .brand' exists and has text content.";
        loader.style.color = "red";
        return;
      }

      function toString(num, digits) {
        return num.toString().padStart(digits, "0");
      }

      function formatDate(inputDate) {
        if (!inputDate) return "";
        const date = new Date(inputDate);
        if (isNaN(date.getTime())) return inputDate;

        const formattedDate =
          toString(date.getDate(), 2) +
          "-" +
          toString(date.getMonth() + 1, 2) +
          "-" +
          toString(date.getFullYear(), 4) +
          " " +
          toString(date.getHours(), 2) +
          ":" +
          toString(date.getMinutes(), 2) +
          ":" +
          toString(date.getSeconds(), 2) +
          ":" +
          toString(date.getMilliseconds(), 3);
        return formattedDate;
      }

      const response = await fetch(
        "https://bo2.inplaynet.com/api/Customer/GetSystemTransaction?" +
          `CurrentPage=1&PageSize=500&OrderColumn=transactionId&OrderDirection=desc&OperationType=2&UserProfileId=${usermyid}&BrandId=${branderValue}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const list = await response.json();

      if (!list || list.length === 0) {
        const tbody = document.createElement("tbody");
        table.appendChild(tbody);
        const noDataRow = document.createElement("tr");
        const noDataCell = document.createElement("td");
        noDataCell.textContent = "No system transactions found.";
        noDataCell.colSpan = 9;
        applyStyles(noDataCell, {
          textAlign: "center",
          padding: "20px",
          color: "#888",
          fontStyle: "italic",
        });
        noDataRow.appendChild(noDataCell);
        tbody.appendChild(noDataRow);
        loader.style.display = "none";
        return;
      }

      const propertiesToRemove = [
        "transactionStatus",
        "operationType",
        "userProfileId",
        "startBalance",
        "endBalance",
        "paymentProvider",
        "paymentChannel",
        "brandAccountingAmount",
        "systemAccountingAmount",
        "localAmount",
        "remoteAmount",
        "initialAmount",
        "localCurrency",
        "remoteCurrency",
        "adminId",
        "adminName",
        "requiresManualConfirmation",
        "remoteTransactionId",
        "transactinoStateId",
        "customerPromoId",
        "brandId",
        "paymentMode",
        "baseTransactionId",
        "brandPaymentConfigId",
        "traderId",
        "lockedByTrader",
        "isFirstDeposit",
        "bonusTemplateId",
        "wagerItemId",
        "shopId",
        "withdrawCode",
        "adminControlPassed",
        "completedInWebShop",
        "confirmDate",
        "transactionGuid",
        "withoutBonus",
        "userName",
        "transactionRefundStatus",
        "userGroups",
        "firstName",
        "lastName",
        "brandName",
        "paymentStatus",
        "brandCurrency",
        "operationTypeId",
        "operationTypeName",
        "direction",
        "isGameOperation",
        "adminComment_AdminName",
        "transactionComment_AdminComment",
        "brandAmountDecimal",
        "systemAmountDecimal",
        "startBalanceDecimal",
        "endBalanceDecimal",
        "localCurrencyCode",
        "countryName",
        "paymentStatusAdminId",
        "paymentStatusAdminName",
        "setReadyAdminId",
        "setReadyDateTime",
        "setReadyAdminName",
        "count",
        "requestDate",
        "actionDate",
        "amount",
        "currency",
      ];

      list.forEach((item) => {
        item.startDate = formatDate(item.startDate);
        item.endDate = formatDate(item.endDate);

        propertiesToRemove.forEach((prop) => {
          delete item[prop];
        });
      });

      const displayedColumns = [
        "transactionId",
        "startDate",
        "endDate",
        "adminUserName",
        "transactionComment",
        "transactionComment_UserName",
        "localAmountDecimal",
        "paymentProviderName",
        "transactionStatusName",
      ];

      const headerMap = {
        transactionId: "Transaction ID",
        startDate: "Start Date",
        endDate: "End Date",
        adminUserName: "Admin User",
        transactionComment: "Comment",
        transactionComment_UserName: "Comment User",
        localAmountDecimal: "Amount (Local)",
        paymentProviderName: "Payment Provider",
        transactionStatusName: "Status",
      };

      const columnStyles = [
        { width: "8%", minWidth: "80px" },
        { width: "12%", minWidth: "130px" },
        { width: "12%", minWidth: "130px" },
        { width: "10%", minWidth: "100px" },
        { width: "15%", minWidth: "150px", wordBreak: "break-word" },
        { width: "10%", minWidth: "100px" },
        { width: "8%", minWidth: "80px" },
        { width: "10%", minWidth: "100px" },
        { width: "8%", minWidth: "80px" },
      ];

      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      table.appendChild(thead);
      thead.appendChild(headerRow);

      displayedColumns.forEach((colKey, index) => {
        const th = document.createElement("th");
        th.textContent = headerMap[colKey] || colKey;
        applyStyles(th, {
          padding: "12px 15px",
          textAlign: "left",
          borderBottom: "1px solid #eeeeee",
          backgroundColor: "#f7f7f7",
          color: "#555555",
          fontWeight: "bold",
          textTransform: "uppercase",
          fontSize: "0.9em",
          letterSpacing: "0.5px",
        });
        if (index === 0) {
          th.style.borderTopLeftRadius = "8px";
        }
        if (index === displayedColumns.length - 1) {
          th.style.borderTopRightRadius = "8px";
        }
        if (columnStyles[index]) {
          applyStyles(th, columnStyles[index]);
        }
        headerRow.appendChild(th);
      });

      const tbody = document.createElement("tbody");
      table.appendChild(tbody);

      list.forEach((item, rowIndex) => {
        const trow = document.createElement("tr");
        if (rowIndex % 2 === 0) {
          applyStyles(trow, { backgroundColor: "#fdfdfd" });
        }
        trow.onmouseover = () =>
          applyStyles(trow, {
            backgroundColor: "#f0f8ff",
            transition: "background-color 0.2s ease",
          });
        trow.onmouseout = () =>
          applyStyles(trow, {
            backgroundColor: rowIndex % 2 === 0 ? "#fdfdfd" : "transparent",
            transition: "background-color 0.2s ease",
          });

        displayedColumns.forEach((colKey, colIndex) => {
          const cell = trow.insertCell(-1);
          let cellValue =
            item[colKey] !== undefined && item[colKey] !== null
              ? item[colKey]
              : "";

          if (colKey === "transactionStatusName") {
            if (cellValue === "Success") {
              cell.style.color = "#0ad00a";
            } else if (cellValue === "Rejected") {
              cell.style.color = "#ff0000";
            } else if (cellValue === "Processing") {
              cell.style.color = "#ffb733";
            }
          }
          cell.innerHTML = cellValue;

          applyStyles(cell, {
            padding: "12px 15px",
            textAlign: "left",
            borderBottom: "1px solid #eeeeee",
          });
          if (columnStyles[colIndex]) {
            applyStyles(cell, columnStyles[colIndex]);
          }
        });
        tbody.appendChild(trow);
      });

      loader.style.display = "none";
    } catch (error) {
      console.error("Error in loadmode:", error);
      loader.textContent = `Error loading data: ${error.message}`;
      loader.style.color = "red";
    }
  }
  document.addEventListener("keydown", handleKeyPress);
})();
