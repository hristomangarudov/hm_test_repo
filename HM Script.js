// ==UserScript==
// @name         HM Script2
// @namespace    http://tampermonkey.net/HM-script2
// @version      3.3.1
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
    const acceptWithdrawAcceptBtn = document.querySelector(
      'div.content > div.actions > div.btn.accept[text_key="ACCEPT"]'
    )
      ? document.querySelector(
          'div.content > div.actions > div.btn.accept[text_key="ACCEPT"]'
        )
      : "";
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
    const defaultInterval = 4 * 60 * 60 * 1000; // 4 hours
    const fastInterval = 1 * 60 * 60 * 1000; // 1 hour

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
  }
  function showDeMotivationalModal() {
    const motivationalGifs = [
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHFyc3o1cTNucTh3bXo1a3lqbzRheWRhejNnMDc0ZjB4NXB0bjJnNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vX9WcCiWwUF7G/giphy.gif",
      "https://i1.sndcdn.com/avatars-000623888460-ygj39m-t1080x1080.jpg",
      "https://preview.redd.it/nm93snupy1i31.jpg?auto=webp&s=0c9751a8e9164d26931acf795bc2653754273ef9",
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
      if (event.shiftKey && event.keyCode === 48 && currentUserID) {
        alert("Diddler");
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
  document.addEventListener("keydown", handleKeyPress);
})();
