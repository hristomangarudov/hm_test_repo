// ==UserScript==
// @name         HM Script2
// @namespace    http://tampermonkey.net/HM-script2
// @version      1.2
// @description  script made for filtering unique user IP matches also has minigames calculator. Shift + 0 is IP command, while Shift + 9 is for the minigames calc
// @author       Hristo Mangarudov
// @match        https://bo2.inplaynet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=upgaming.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        window.close
// @downloadURL  https://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@raw.githubusercontent.com/hristomangarudov/hm_test_repo/main/HM%20Script
// @updateURL    https://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@raw.githubusercontent.com/hristomangarudov/hm_test_repo/refs/heads/main/HM%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* global $ */
    /* global Main */
    /* global EventEmitter */
    (function () {
    const acceptWithdrawAcceptBtn = document.querySelector('div.content > div.actions > div.btn.accept[text_key="ACCEPT"]');
    if (acceptWithdrawAcceptBtn) {
    acceptWithdrawAcceptBtn.style.position = 'relative';
    acceptWithdrawAcceptBtn.style.zIndex = '2';
    acceptWithdrawAcceptBtn.style.left = '-100%';
    acceptWithdrawAcceptBtn.style.backgroundColor = 'black';
    } else {
        console.log("cant find it");
    }
    })();

    let skipCurrentMonth = true; //IMPORTANT FOR POD


    function parseDate(dateString) {
        const regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        const match = dateString.match(regex);
        if (match) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) - 1;
            const day = parseInt(match[3]);
            const hours = parseInt(match[4]);
            const minutes = parseInt(match[5]);
            const seconds = parseInt(match[6]);
            return new Date(year, month, day, hours, minutes, seconds);
        }
        return null;
    }

    function selectUserID() {
        const spanElement = document.querySelector('.user-info > .user > span');
        return spanElement ? spanElement.textContent : "";
    }
    function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
   }
    function formatDateNoYYY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear(); // Get year

    return `${day}/${month}`;
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
        const startDtInput = document.querySelector('input[name="TransactionStartDt"]');
        const toDtInput = document.querySelector('input[name="TransactionToDt"]');
        const startDt = startDtInput ? startDtInput.value : "";
        const toDt = toDtInput ? toDtInput.value : "";
        const convertedStartDt = convertAndEncodeDate(startDt);
        const convertedToDt = convertAndEncodeDate(toDt);
        return { startDt: convertedStartDt, toDt: convertedToDt };
    }
function createHangmanModal() {
  let words = [
  "APPLE", "BANANA", "CHOCOLATE", "DOG", "ELEPHANT", "FLAMINGO", "GUITAR", "HORIZON", "ICEBERG", "JUNGLE",
  "KANGAROO", "LIGHTHOUSE", "MOUNTAIN", "NOTEBOOK", "OCTOPUS", "PENGUIN", "QUICKSAND", "RAINBOW", "SUNFLOWER", "TELESCOPE",
  "UMBRELLA", "VOLCANO", "WATERFALL", "XYLOPHONE", "YESTERDAY", "ZEBRA", "ADVENTURE", "BUTTERFLY", "CANDLE", "DRAGONFLY",
  "ECHO", "FIREFLY", "GALAXY", "HAPPINESS", "ISLAND", "JOURNEY", "KNOWLEDGE", "LAUGHTER", "MOONLIGHT", "NEBULA",
  "OCEAN", "PARADISE", "QUIET", "RIVER", "STARLIGHT", "TRANQUIL", "UNIVERSE", "VOYAGE", "WHISPER", "ZEPHYR",
  "BALLOON", "CACTUS", "DOLPHIN", "EMERALD", "FEATHER", "GLACIER", "HARBOR", "INFINITY", "JIGSAW", "KOALA",
  "LANTERN", "MEADOW", "NIGHTFALL", "ORBIT", "PAVILION", "QUARTZ", "REFLECTION", "SYMPHONY", "TORNADO", "UPLIFT",
  "VORTEX", "WONDER", "YONDER", "ZENITH", "ASTRONOMY", "BLOSSOM", "CANYON", "DAYDREAM", "ENCHANT", "FOUNTAIN",
  "GOSSAMER", "HORIZON", "ILLUMINATE", "JUBILEE", "KINDRED", "LULLABY", "MIRAGE", "NECTAR", "OBSIDIAN", "PASSION",
  "QUINTESSENCE", "RADIANCE", "SERENITY", "TWILIGHT", "UNITY", "VIBRANT", "WANDERLUST", "XENON", "YEARNING", "ZEN"
];

  let word = words[Math.floor(Math.random() * words.length)];
  let attemptsLimit = 6;
  let attemptsLeft = attemptsLimit;
  let guessedLetters = [];
  let hintsUsed = 0;
  let displayWord = "_ ".repeat(word.length).trim();

  const hangmanStages = [
`
   _______
   |     |
   |
   |
   |
   |
 __|__
`,
`
   _______
   |     |
   |     O
   |
   |
   |
 __|__
`,
`
   _______
   |     |
   |     O
   |     |
   |
   |
 __|__
`,
`
   _______
   |     |
   |     O
   |    /|
   |
   |
 __|__
`,
`
   _______
   |     |
   |     O
   |    /|\\
   |
   |
 __|__
`,
`
   _______
   |     |
   |     O
   |    /|\\
   |    /
   |
 __|__
`,
`
   _______
   |     |
   |     O
   |    /|\\
   |    / \\
   |
 __|__
`
  ];


  const modalOverlay = document.createElement("div");
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex; justify-content: center; align-items: center;
    z-index: 10000;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    background: white; padding: 20px; width: 320px;
    border-radius: 10px;
    font-family: monospace;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    display:flex; align-items:center; justify-content:center; flex-direction:column; flex-wrap:wrap;
  `;

  modal.innerHTML = `
    <h2>Hangman Game</h2>
    <pre id="hangman-figure">${hangmanStages[0]}</pre>>
    <p id="word-display">${displayWord}</p>
    <p>Attempts left: <span id="attempts-left">${attemptsLeft}</span></p>
    <div>
    <div id="hang-container">
    <input id="guess-input" type="text" maxlength="1" placeholder="Enter a letter" />
    <div id="hang-button-container">
    <button id="submit-guess">Submit</button>
    <button id="hint-button">Hint</button>
    <button id="reset-game">Reset</button>
    </div>
    </div>
    <div>
    <p id="result-message"></p>
    <div>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  let hangContainer = document.getElementById("hang-container")
  let hangButtonContainer = document.getElementById("hang-button-container")
  hangContainer.style.cssText = `
  display: flex;
  flex-direction:column;
  align-items:center;
  `
  hangButtonContainer.style.cssText = `
  display: flex;
  gap:5px;
  `
  const wordDisplayElement = document.getElementById("word-display");
  const attemptsLeftElement = document.getElementById("attempts-left");
  const hangmanFigureElement = document.getElementById("hangman-figure");
  const resultMessageElement = document.getElementById("result-message");
  const guessInputElement = document.getElementById("guess-input");
  const submitGuessButton = document.getElementById("submit-guess");
  const resetGameButton = document.getElementById("reset-game");
  const hintButton = document.getElementById("hint-button");
  hintButton.className = 'btn accept accept-items';
  submitGuessButton.className = 'btn accept accept-items';
  resetGameButton.className = 'btn accept accept-items';

  function updateUI() {
    wordDisplayElement.textContent = displayWord;
    attemptsLeftElement.textContent = attemptsLeft;
    hangmanFigureElement.textContent = hangmanStages[attemptsLimit - attemptsLeft];

    if (!displayWord.includes("_")) {
      resultMessageElement.textContent = "🎉 Congratulations, you won!";
      disableGame();
    } else if (attemptsLeft === 0) {
      resultMessageElement.textContent = `💀 Game over! The word was: ${word}`;
      disableGame();
    }
  }


  function disableGame() {
    guessInputElement.disabled = true;
    submitGuessButton.disabled = true;
    hintButton.disabled = true;
  }

  submitGuessButton.addEventListener("click", () => {
    const guess = guessInputElement.value.toUpperCase();
    guessInputElement.value = "";

    if (guess.length !== 1 || guessedLetters.includes(guess)) {
      resultMessageElement.textContent = "Invalid guess or already guessed!";
      return;
    }

    guessedLetters.push(guess);

    if (word.includes(guess)) {
      displayWord = word
        .split("")
        .map((letter, index) => guessedLetters.includes(letter) ? letter : "_")
        .join(" ");
    } else {
      attemptsLeft -= 1;
    }

    updateUI();
  });


  hintButton.addEventListener("click", () => {
    if (hintsUsed < 1) {
      hintButton.disabled = true;
      let newDisplayWord = displayWord.split(" ");
      let unrevealedIndexes = [];

      word.split("").forEach((letter, index) => {
        if (!guessedLetters.includes(letter)) {
          unrevealedIndexes.push(index);
        }
      });

      if (unrevealedIndexes.length > 0) {
        let randomIndex = unrevealedIndexes[Math.floor(Math.random() * unrevealedIndexes.length)];
        guessedLetters.push(word[randomIndex]);
        newDisplayWord[randomIndex] = word[randomIndex];
      }

      displayWord = newDisplayWord.join(" ");
      hintsUsed++;
      updateUI();
    } else {
      resultMessageElement.textContent = "You've already used your hint!";
    }
  });


  resetGameButton.addEventListener("click", () => {
    guessInputElement.disabled = false;
    submitGuessButton.disabled = false;
    hintButton.disabled = false;
    resultMessageElement.textContent = "";
    word = words[Math.floor(Math.random() * words.length)];
    attemptsLeft = attemptsLimit;
    guessedLetters = [];
    displayWord = "_ ".repeat(word.length).trim();
    hintsUsed = 0;
    updateUI();
  });

  function closeModal(event) {
    if (!modal.contains(event.target)) {
      modalOverlay.remove();
      document.removeEventListener("click", closeModal);
    }
  }
  document.addEventListener("click", closeModal);

  updateUI();
}



    function extractValuesWithDateAndCountFromTable(tableId) {
        const valuesWithDateAndCount = {};

        const table = document.getElementById(tableId);

        if (table) {
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(function(row) {
                const cells = row.querySelectorAll('td');

                let id = null;
                let ip = null;
                for (let i = 0; i < cells.length; i++) {
                    const anchor = cells[i].querySelector('a');
                    if (anchor) {
                        id = anchor.textContent.trim();
                        break;
                    }
                }

                let date = null;
                for (let j = 0; j < cells.length; j++) {
                    const potentialDate = parseDate(cells[j].textContent.trim());
                    if (potentialDate) {
                        date = potentialDate;
                        break;
                    }
                }

                if (cells[2]) {
                    ip = cells[2].textContent.trim();
                }

                if (id && date && ip) {
                    const timeDiff = Math.abs(date.getTime() - Date.now());

                    if (!valuesWithDateAndCount[id]) {
                        valuesWithDateAndCount[id] = {
                            date: date,
                            count: 1,
                            ips: new Set(ip.split(',').map(s => s.trim())),
                            timeDiff: timeDiff
                        };
                    } else {
                        valuesWithDateAndCount[id].count++;
                        ip.split(',').map(s => s.trim()).forEach(ip => valuesWithDateAndCount[id].ips.add(ip));
                    }
                }
            });
        } else {
            console.error('Table not found');
        }

        return valuesWithDateAndCount;
    }

    function makeBTN() {
        const container = document.getElementById("SysTrans");
        const container2 = container.querySelector('tbody tr');
        const sortBTN = document.createElement('button');
        sortBTN.type = 'button';
        sortBTN.innerHTML = 'Filter Data';
        sortBTN.className = 'btn accept accept-items';
        sortBTN.onclick = function() {
            const valuesWithDateAndCount = extractValuesWithDateAndCountFromTable('SysTrans');

            const modalOverlay = document.createElement('div');
            modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 100000; display: flex; justify-content: center; align-items: center;';

            const modalDialog = document.createElement('div');
            modalDialog.style.cssText = 'background-color: #fff; border-radius: 5px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); max-width: 80%; max-height: 80%; overflow: auto;';

            const modalContent = document.createElement('div');
            modalContent.style.cssText = 'padding: 20px;';

            const infoTable = document.createElement('table');
            infoTable.style.cssText = 'border-collapse: collapse; width: 100%;';
            const headerRow = infoTable.insertRow();
            const headers = ['ID', 'Count', 'Date', 'IPs'];
            headers.forEach(function(headerText) {
                const headerCell = document.createElement('th');
                headerCell.textContent = headerText;
                headerRow.appendChild(headerCell);
            });

            const allIPs = [];
            for (const id in valuesWithDateAndCount) {
                valuesWithDateAndCount[id].ips.forEach(ip => allIPs.push(ip));
            }
            const ipCounts = {};
            allIPs.forEach(ip => {
                ipCounts[ip] = ipCounts[ip] ? ipCounts[ip] + 1 : 1;
            });
            let maxCount = 0;
            for (const ip in ipCounts) {
                maxCount = Math.max(maxCount, ipCounts[ip]);
            }
            const mostFrequentIPs = Object.keys(ipCounts).filter(ip => ipCounts[ip] === maxCount);

            for (const id in valuesWithDateAndCount) {
                const dataRow = infoTable.insertRow();
                const rowData = [
                    id,
                    valuesWithDateAndCount[id].count,
                    valuesWithDateAndCount[id].date.toISOString(),
                    Array.from(valuesWithDateAndCount[id].ips).join(', ')
                ];
                rowData.forEach(function(cellData, index) {
                    const cell = dataRow.insertCell();
                    cell.textContent = cellData;
                    cell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';

                    if (index === 3) {
                        mostFrequentIPs.forEach(mostFrequentIP => {
                            if (valuesWithDateAndCount[id].ips.has(mostFrequentIP)) {
                                cell.innerHTML = cell.innerHTML.replace(new RegExp(mostFrequentIP, 'g'), '<span style="color: red;">' + mostFrequentIP + '</span>');
                            }
                        });
                    }
                });
            }

            modalContent.appendChild(infoTable);
            modalDialog.appendChild(modalContent);
            modalOverlay.appendChild(modalDialog);

            modalOverlay.addEventListener('click', function(event) {
                if (event.target === modalOverlay) {
                    modalOverlay.remove();
                }
            });

            document.body.appendChild(modalOverlay);
        };
        if (container) {
            const items = container.querySelectorAll('tbody tr');
            container2.append(sortBTN);
        }
    }

function miniGamesCalc(data) {
    console.log(data);

    const gamesWithMultiplier = ["MiniGames[Type1]", "MiniGames[Type2]"];
    const gamesWithoutMultiplier = ["MiniGames[Plinko]", "MiniGames[Frog]", "MiniGames[Keno 40]", "LambdaGaming[8BITPlinko]", "MiniGames[Penalty]"];

    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 100000; display: flex; justify-content: center; align-items: center;';

    const modalDialog = document.createElement('div');
    modalDialog.style.cssText = 'background-color: #fff; border-radius: 5px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); max-width: 80%; max-height: 80%; overflow: auto;';

    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'padding: 20px;';

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
            } else if (gamesWithMultiplier.includes(currentTransaction.accountName) || currentTransaction.accountName.startsWith("MiniGames") || currentTransaction.gameTypeName === "MiniGames") {
                if (i > 0 && relevantTransactions[i - 1].operationTypeName === "Win") {
                    const nextTransaction = relevantTransactions[i - 1];
                    console.log(nextTransaction.localAmount / currentTransaction.localAmount,(nextTransaction.localAmount / currentTransaction.localAmount).toFixed(2))
                    if ((nextTransaction.localAmount / currentTransaction.localAmount).toFixed(2) >= 1.3) {
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

    modalOverlay.addEventListener('click', function(event) {
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
        const response = await fetch(`https://bo2.inplaynet.com/api/customer/searchcustomertransactions?UserProfileId=${userID}&CurrentPage=${page}&PageSize=500&TransactionId=&TransactionGuid=&GameId=&TransactionStartDt=${startDt.encodedCustom}&TransactionToDt=${toDt.encodedCustom}&AmountFrom=&AmountTo=&RequiresManualConfirmation=&GameOperationOnly=0&StartDate=${startDt.encodedStandard}&ToDate=${toDt.encodedStandard}&SearchCurrency=`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        allTransactions = allTransactions.concat(data.transactions);


        data.transactions.forEach(transaction => {
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
        totalWithdrawalAmount: totalWithdrawalAmount
    };
}
    async function fetchAllTransactions2(userID, startDt, toDt, totalPages) {
    let allTransactions = [];
    let totalBetAmount = 0;
    let totalDepositAmount = 0;
    let totalWithdrawalAmount = 0;

    for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`https://bo2.inplaynet.com/api/customer/searchcustomertransactions?UserProfileId=${userID}&CurrentPage=${page}&PageSize=500&TransactionId=&TransactionGuid=&GameId=&TransactionStartDt=&TransactionToDt=&AmountFrom=&AmountTo=&RequiresManualConfirmation=&GameOperationOnly=1&StartDate=&ToDate=&SearchCurrency=`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        allTransactions = allTransactions.concat(data.transactions);


        data.transactions.forEach(transaction => {
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
        totalWithdrawalAmount: totalWithdrawalAmount
    };
}
function showLoader() {
    const loader = document.createElement('div');
    loader.innerHTML = '<p style="color: red;"><b>Calculating Minigames...</b></p>';
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
        new Date(oldest.orderDate) < new Date(current.orderDate) ? oldest : current
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
        .filter(transaction => transaction.operationTypeName === "Deposit")
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 5);
    if (latestDeposits.length === 0) {
        console.warn("No deposit transactions found.");
        return;
    }


    const totalAmount = latestDeposits.reduce((sum, transaction) => sum + transaction.localAmount, 0);
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
    const loader = showLoader();
    if (event.shiftKey && event.keyCode === 48) { // Shift + 0 for filtering data
        makeBTN();
    } else if (event.shiftKey && event.keyCode === 57) { // Shift + 9 for minigames calculator
        const { startDt, toDt } = selectInputDatesByName();
        const currentUserID = selectUserID();
        let totalPages = 1;

        const spanPageElement = document.querySelector('tfoot.pagination tr td > div.wrapper > ul.nums > li:last-child > span');
        if (spanPageElement) {
            totalPages = parseInt(spanPageElement.textContent, 10);
            console.log('Total pages:', totalPages);
        }

        if (currentUserID) {
            try {
                const { transactions, totalBetAmount, totalDepositAmount, totalWithdrawalAmount } = await fetchAllTransactions(currentUserID, startDt, toDt, totalPages);
                const data = {
                    transactions: transactions,
                    count: transactions.length,
                    sumBet: totalBetAmount,
                    sumDeposit: totalDepositAmount,
                    sumWithdraw: totalWithdrawalAmount
                };
                miniGamesCalc(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        } else {
            alert("User ID not found.");
        }
    } else if (event.shiftKey && event.keyCode === 56) { // Shift + 8 for custom filtered transactions
        const { startDt, toDt } = selectInputDatesByName();
        const currentUserID = selectUserID();
        let totalPages = 1;

        const spanPageElement = document.querySelector('tfoot.pagination tr td > div.wrapper > ul.nums > li:last-child > span');
        if (spanPageElement) {
            totalPages = parseInt(spanPageElement.textContent, 10);
            console.log('Total pages:', totalPages);
        }

        if (currentUserID) {
            try {
                const { transactions } = await fetchAllTransactions2(currentUserID, startDt, toDt, totalPages);

                customTransactionFilter(transactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        } else {
            alert("User ID not found.");
        }
    }else if (event.shiftKey && event.keyCode === 55) { // Shift + 7 for free spin user check
    const { startDt, toDt } = selectInputDatesByName();
    const currentUserID = selectUserID();
    let totalPages = 1;

    const spanPageElement = document.querySelector('tfoot.pagination tr td > div.wrapper > ul.nums > li:last-child > span');
    if (spanPageElement) {
        totalPages = parseInt(spanPageElement.textContent, 10);
        console.log('Total pages:', totalPages);
    }

    if (currentUserID) {
        try {
            const { transactions } = await fetchAllTransactions2(currentUserID, startDt, toDt, totalPages);

            freeSpinUserChecker(transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    } else {
        alert("User ID not found.");
    }
}else if (event.shiftKey && event.keyCode === 189) { // Shift + NUM1 for Hangman game
    console.log("asdasdasdasdasasd")
    createHangmanModal();
}
    removeLoader(loader);
}



function customTransactionFilter(transactions) {
    console.log("filter1")
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

    let latestValidTransaction = { Noda: null, Payopp: null };
    const transactionsByMonth = {};

    const transactionTypesAll = new Set();
    const transactionTypesSixMonths = new Set();
    const transactionTypesThreeMonths = new Set();
    const transactionTypesOneMonth = new Set();

    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.orderDate);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();

         if(skipCurrentMonth){
                 if (
            (transaction.accountName.includes("Payop") || transaction.accountName.includes("Noda")) &&
            transaction.operationTypeName !== "Withdraw"
        ) {
            totalSum += transaction.localAmount;

            const monthKey = `${transactionYear}-${transactionMonth}`;
            if (!transactionsByMonth[monthKey]) transactionsByMonth[monthKey] = { Noda: 0, Payopp: 0 };

            if (transaction.accountName.includes("Payop")) {
                transactionsByMonth[monthKey].Payopp++;
                transactionTypesAll.add("Payop");
            }
            if (transaction.accountName.includes("Noda")) {
                transactionsByMonth[monthKey].Noda++;
                transactionTypesAll.add("Noda");
            }

            if (transaction.localCurrencyCode === "EUR") {
                isEUR = true;
            }

            if (transactionDate >= sixMonthsAgo && transactionDate <= today) {
                sixMonthSum += transaction.localAmount;
                if (transaction.accountName.includes("Payop")) transactionTypesSixMonths.add("Payop");
                if (transaction.accountName.includes("Noda")) transactionTypesSixMonths.add("Noda");
            }

            if (transactionDate >= threeMonthsAgo && transactionDate <= today) {
                threeMonthSum += transaction.localAmount;
                if (transaction.accountName.includes("Payop")) transactionTypesThreeMonths.add("Payop");
                if (transaction.accountName.includes("Noda")) transactionTypesThreeMonths.add("Noda");
            }

            if (transactionDate >= oneMonthsAgo && transactionDate <= today) {
                oneMonthSum += transaction.localAmount;
                if (transaction.accountName.includes("Payop")) transactionTypesOneMonth.add("Payop");
                if (transaction.accountName.includes("Noda")) transactionTypesOneMonth.add("Noda");
            }
        if (skipCurrentMonth && transactionMonth === currentMonth && transactionYear === currentYear) {
            return;
        }

        if (transaction.accountName.includes("Payop") && (!latestValidTransaction.Payopp || transactionDate > latestValidTransaction.Payopp)) {
            latestValidTransaction.Payopp = transactionDate;
        }
        if (transaction.accountName.includes("Noda") && (!latestValidTransaction.Noda || transactionDate > latestValidTransaction.Noda)) {
            latestValidTransaction.Noda = transactionDate;
        }

    }
         }else{
                 if (skipCurrentMonth && transactionMonth === currentMonth && transactionYear === currentYear) {
            return;
        }
        if (
            (transaction.accountName.includes("Payop") || transaction.accountName.includes("Noda")) &&
            transaction.operationTypeName !== "Withdraw"
        ) {
            totalSum += transaction.localAmount;

            const monthKey = `${transactionYear}-${transactionMonth}`;
            if (!transactionsByMonth[monthKey]) transactionsByMonth[monthKey] = { Noda: 0, Payopp: 0 };


            if (transaction.accountName.includes("Payop")) {
                transactionsByMonth[monthKey].Payopp++;
                transactionTypesAll.add("Payop");
            }
            if (transaction.accountName.includes("Noda")) {
                transactionsByMonth[monthKey].Noda++;
                transactionTypesAll.add("Noda");
            }

            if (transaction.localCurrencyCode === "EUR") {
                isEUR = true;
            }

            if (transactionDate >= sixMonthsAgo && transactionDate <= today) {
                sixMonthSum += transaction.localAmount;
                if (transaction.accountName.includes("Payop")) transactionTypesSixMonths.add("Payop");
                if (transaction.accountName.includes("Noda")) transactionTypesSixMonths.add("Noda");
            }

            if (transactionDate >= threeMonthsAgo && transactionDate <= today) {
                threeMonthSum += transaction.localAmount;
                if (transaction.accountName.includes("Payop")) transactionTypesThreeMonths.add("Payop");
                if (transaction.accountName.includes("Noda")) transactionTypesThreeMonths.add("Noda");
            }

            if (transactionDate >= oneMonthsAgo && transactionDate <= today) {
                oneMonthSum += transaction.localAmount;
                if (transaction.accountName.includes("Payop")) transactionTypesOneMonth.add("Payop");
                if (transaction.accountName.includes("Noda")) transactionTypesOneMonth.add("Noda");
            }


        if (transaction.accountName.includes("Payop") && (!latestValidTransaction.Payopp || transactionDate > latestValidTransaction.Payopp)) {
            latestValidTransaction.Payopp = transactionDate;
        }
        if (transaction.accountName.includes("Noda") && (!latestValidTransaction.Noda || transactionDate > latestValidTransaction.Noda)) {
            latestValidTransaction.Noda = transactionDate;
        }
    }
         }


    });

    const getMonthName = date => date.toLocaleString("default", { month: "long" });

const handlePodRequest = (transactionSet, sumCheck, typeString, latestTransaction) => {
    console.log(latestTransaction)
    if (latestTransaction) {
    console.log(latestTransaction)
    if (latestTransaction) {
        console.log(latestTransaction)
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

            return `<pre>PoD requested for ${monthName} (${transactionTypes.join(" and ")})     |     Count:${transactionCount} (N:${transactionNoda} P:${transactionPayopp})</pre>`;
        }
    }}
    return "";
}

    let podRequestText = "";

    const latestTransaction = latestValidTransaction.Noda && latestValidTransaction.Payopp
        ? (latestValidTransaction.Noda > latestValidTransaction.Payopp ? latestValidTransaction.Noda : latestValidTransaction.Payopp)
        : latestValidTransaction.Noda || latestValidTransaction.Payopp;

    if (sixMonthSum >= 10000 && threeMonthSum > 0 && oneMonthSum > 0) {
        podRequestText = handlePodRequest(transactionTypesOneMonth, oneMonthSum, Array.from(transactionTypesOneMonth).join(" and "), latestTransaction);
    } else if (sixMonthSum >= 10000 && threeMonthSum > 0 && oneMonthSum === 0) {
        podRequestText = handlePodRequest(transactionTypesThreeMonths, threeMonthSum, Array.from(transactionTypesThreeMonths).join(" and "), latestTransaction);
    } else if (sixMonthSum >= 10000 && threeMonthSum === 0) {
        podRequestText = handlePodRequest(transactionTypesSixMonths, sixMonthSum, Array.from(transactionTypesSixMonths).join(" and "), latestTransaction);
    }

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 100000; display: flex; justify-content: center; align-items: center;';

    const modalDialog = document.createElement('div');
    modalDialog.style.cssText = 'background-color: #fff; border-radius: 5px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); max-width: 50%; padding: 20px; display:flex; flex-direction: column ';

    if (isEUR) {
        modalDialog.innerHTML = `
            <h3>Nope. EUR. No PoD required for EUR transactions</h3>
            <img src="https://media1.tenor.com/m/WUmceUdDbW4AAAAd/tom-and-jerry-slap.gif" alt="Transaction Summary" style="width: 100%; height: auto;">
        `;
    } else {
        modalDialog.innerHTML = `
            <button type="button" id="ignoreCurrentMonthBtn" class="btn accept accept-items" display="block" onClick="changeMonthSkip()">${skipCurrentMonth ? "Include Current Month" : "Skip Current Month"}</button>
            <h3>Transaction Summary</h3>
            <p>Total Sum of All Filtered Transactions: <b>${totalSum.toFixed(2)}</b> (${Array.from(transactionTypesAll).join(" and ")})</p>
            <p>Total Sum of All Filtered Transactions in the <b>last 6 Months: ${sixMonthSum.toFixed(2)}</b> (${Array.from(transactionTypesSixMonths).join(" and ")})</p>
            <p>Total Sum of All Filtered Transactions in the <b>last 3 Months: ${threeMonthSum.toFixed(2)}</b> (${Array.from(transactionTypesThreeMonths).join(" and ")})</p>
            <p>Total Sum of All Filtered Transactions in the <b>last Month: ${oneMonthSum.toFixed(2)}</b> (${Array.from(transactionTypesOneMonth).join(" and ")})</p>
            <hr>
            <p><strong>${podRequestText}</strong></p>
        `;
    const button = modalDialog.querySelector("#ignoreCurrentMonthBtn");
    button.addEventListener("click", changeMonthSkip);
    }


    modalOverlay.appendChild(modalDialog);

    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            modalOverlay.remove();
        }
    });

    document.body.appendChild(modalOverlay);
}

function changeMonthSkip() {
    const existingOverlays = document.querySelectorAll('.modal-overlay');
    existingOverlays.forEach(overlay => overlay.remove());
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

        const spanPageElement = document.querySelector('tfoot.pagination tr td > div.wrapper > ul.nums > li:last-child > span');
        if (spanPageElement) {
            totalPages = parseInt(spanPageElement.textContent, 10);
            console.log('Total pages:', totalPages);
        }

        if (currentUserID) {
            const { transactions } = await fetchAllTransactions2(currentUserID, startDt, toDt, totalPages);
            customTransactionFilter(transactions);
        } else {
            alert("User ID not found.");
        }
    } catch (error) {
        console.error("Error in runChangeMonthSkipLogic:", error);
    }
    removeLoader(loader)
}
(function insertImageWithAnimatedBorder(containerSelector, imageUrl) {
  const currentFraudAgent = document.querySelector('div.desktop-header-full-name > div.name');
  const container = document.querySelector('nav.sidebar > div.content-wrapper');
  const imgURL =  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/defab05d-48e2-49f8-9e6c-74b3434b61a2/d6se8de-d10f089b-5b9c-40fa-b919-42a2a37f4781.png'
  const imgStitchURL = 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnE4MHB3anIxc2M3ZDh2MWU1c3E4NmEzZnNoZ2R4bzFrY2NrcjB0NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/L9YGSZcBdi2yQrU69K/giphy.gif'
  if(currentFraudAgent){
      if(currentFraudAgent.children[1]){
          console.log(currentFraudAgent.children[1].textContent)
          if(currentFraudAgent.children[1].textContent === "FraudHM"){
                if (container) {
    const img = document.createElement('img');
    img.src = imgURL;
    img.alt = 'Decorative Image';
    img.style.width = '95%';
    img.style.display = 'block';
    img.style.margin = '10px auto';

    img.style.position = 'relative';
    img.style.border = '4px solid transparent';
    img.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.9)';
    img.style.animation = 'border-anim 4s linear infinite';

    const style = document.createElement('style');
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
    const backgroundEl1 = document.querySelector('nav.sidebar> div.content-wrapper');
    const backgroundEl2 = document.querySelector('nav.sidebar> div.content-wrapper > a.logo-url');
    const backgroundEl3 = document.querySelector('header');
    const backgroundEl4 = document.querySelector('main >div.content-wrapper')

    backgroundEl4.style.background = 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/12/Zoldyck-Family.jpg)'
    backgroundEl4.style.backgroundSize = 'cover'
    backgroundEl4.style.backgroundPosition = 'center'

    backgroundEl1.style.backgroundImage = 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )'
    backgroundEl2.style.backgroundImage = 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )'
    backgroundEl3.style.backgroundImage = 'linear-gradient( 271deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )'
    const zenoImg = document.createElement('img')
    zenoImg.src = 'https://d1m9vqlvl3fy94.cloudfront.net/role/attachment/745511/default_239257download1.jpeg';
    zenoImg.style.width = '50px'
    zenoImg.style.height = '50px'
    const fraudSpan = document.querySelector('div.desktop-header-full-name> div.name');
    const firstFraudSpanChild = fraudSpan.childNodes[0]
    if(firstFraudSpanChild){
        fraudSpan.insertBefore(zenoImg,firstFraudSpanChild)
        firstFraudSpanChild.style.display = "none"
    }


    const secondChild = container.childNodes[1];
    if (secondChild) {
      container.insertBefore(img, secondChild);
    }
  } else {
    console.error(`Container not found: ${containerSelector}`);
  }
          }else if(currentFraudAgent.children[1].textContent === "FraudMK"){
    const backgroundEl1 = document.querySelector('nav.sidebar> div.content-wrapper');
    const backgroundEl2 = document.querySelector('nav.sidebar> div.content-wrapper > a.logo-url');
    const backgroundEl3 = document.querySelector('header');
    backgroundEl1.style.backgroundImage = 'linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)'
    backgroundEl2.style.backgroundImage = 'linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)'
    backgroundEl3.style.backgroundImage = 'linear-gradient(271deg, #c6ffdd, #fbd786, #f7797d)'
          }else if(currentFraudAgent.children[1].textContent === "FraudkvBG"){
    const backgroundEl1 = document.querySelector('nav.sidebar> div.content-wrapper');
    const backgroundEl2 = document.querySelector('nav.sidebar> div.content-wrapper > a.logo-url');
    const backgroundEl3 = document.querySelector('header');
                              if (container) {
    const img = document.createElement('img');
    img.src = "https://1000logos.net/wp-content/uploads/2017/04/Logo-Liverpool.png";
    img.alt = 'Decorative Image';
    img.style.width = '95%';
    img.style.display = 'block';
    img.style.margin = '10px auto';
    img.style.maxHeight = '250px'

    img.style.position = 'relative';
    img.style.border = '4px solid transparent';

    img.style.animation = 'border-anim 4s linear infinite';

    const style = document.createElement('style');
    style.textContent = `
          border-color: #ff6f61;
    `;
    document.head.appendChild(style);
    const backgroundEl1 = document.querySelector('nav.sidebar> div.content-wrapper');
    const backgroundEl2 = document.querySelector('nav.sidebar> div.content-wrapper > a.logo-url');
    const backgroundEl3 = document.querySelector('header');
    backgroundEl1.style.backgroundColor = 'rgba(255,177,153,1)'
    backgroundEl2.style.backgroundColor = 'rgba(255,177,153,1)'
    backgroundEl3.style.backgroundColor = 'rgba(255,177,153,1)'
    const zenoImg = document.createElement('img')
    zenoImg.src = 'https://app.skin.land/market_images/35648_s.png';
    zenoImg.style.width = '50px'
    zenoImg.style.height = '50px'
    const fraudSpan = document.querySelector('div.desktop-header-full-name> div.name');
    const firstFraudSpanChild = fraudSpan.childNodes[0]
    if(firstFraudSpanChild){
        fraudSpan.insertBefore(zenoImg,firstFraudSpanChild)
        firstFraudSpanChild.style.display = "none"
    }


    const secondChild = container.childNodes[1];
    if (secondChild) {
      container.insertBefore(img, secondChild);
    }
  } else {
    console.error(`Container not found: ${containerSelector}`);
  }
          }else if(currentFraudAgent.children[1].textContent === "FraudPB"){
                    if (container) {
    const img = document.createElement('img');
    img.src = 'https://www.symbols.com/images/symbol/3292_world-of-warcraft-horde-logo.png';
    img.alt = 'Decorative Image';
    img.style.width = '85%'
    img.style.maxHeight = "20em"
    img.style.display = 'block';
    img.style.margin = '10px auto';


    img.style.position = 'relative';
    img.style.border = '4px solid transparent';
    img.style.animation = 'border-anim 4s linear infinite';

    const style = document.createElement('style');

    document.head.appendChild(style);
    const backgroundEl1 = document.querySelector('nav.sidebar> div.content-wrapper');
    const backgroundEl2 = document.querySelector('nav.sidebar> div.content-wrapper > a.logo-url');
    const backgroundEl3 = document.querySelector('header');
    backgroundEl1.style.backgroundImage = 'linear-gradient(to right, rgb(237, 33, 58), rgb(147, 41, 30))'
    backgroundEl2.style.backgroundImage = 'linear-gradient(to right, rgb(237, 33, 58), rgb(147, 41, 30))'
    backgroundEl3.style.backgroundImage = 'linear-gradient(271deg, rgb(237, 33, 58), rgb(147, 41, 30))'
    backgroundEl3.style.color = 'white'
    backgroundEl3.querySelectorAll("*").forEach(child => {
    child.style.color = "white";
    })
    const brandsSelect = document.querySelector('header>div.search-brand')
    brandsSelect.style.color = '#5f5f5f'
    brandsSelect.querySelectorAll("*").forEach(child => {
    child.style.color = "#5f5f5f";
    })
    const zenoImg = document.createElement('img')
    zenoImg.src = 'https://img.rankedboost.com/wp-content/uploads/2019/05/WoW-Classic-Warlock-Guide.png';
    zenoImg.style.width = '50px'
    zenoImg.style.height = '50px'
    const fraudSpan = document.querySelector('div.desktop-header-full-name> div.name');
    const firstFraudSpanChild = fraudSpan.childNodes[0]
    if(firstFraudSpanChild){
        fraudSpan.insertBefore(zenoImg,firstFraudSpanChild)
        firstFraudSpanChild.style.display = "none"
    }


    const secondChild = container.childNodes[1];
    if (secondChild) {
      container.insertBefore(img, secondChild);
    }
  } else {
    console.error(`Container not found: ${containerSelector}`);
  }

}
          else if(currentFraudAgent.children[1].textContent === "FraudBGaa"){
                              if (container) {
    const img = document.createElement('img');
    img.src = imgStitchURL;
    img.alt = 'Decorative Image';
    img.style.width = '95%';
    img.style.display = 'block';
    img.style.margin = '10px auto';
    img.style.maxHeight = '250px'

    img.style.position = 'relative';
    img.style.border = '4px solid transparent';

    img.style.animation = 'border-anim 4s linear infinite';

    const style = document.createElement('style');
    style.textContent = `
          border-color: #ff6f61;
    `;
    document.head.appendChild(style);
    const backgroundEl1 = document.querySelector('nav.sidebar> div.content-wrapper');
    const backgroundEl2 = document.querySelector('nav.sidebar> div.content-wrapper > a.logo-url');
    const backgroundEl3 = document.querySelector('header');
    backgroundEl1.style.backgroundImage = 'linear-gradient(257deg, rgba(48,181,255,0.9808298319327731) 11%, rgba(38,243,255,1) 62%)'

    backgroundEl2.style.backgroundImage = 'linear-gradient(257deg, rgba(48,181,255,0.9808298319327731) 11%, rgba(48,181,255,1) 62%)'


    backgroundEl3.style.backgroundImage = 'linear-gradient(90deg, rgba(48,181,255,0.9808298319327731) 11%, rgba(38,243,255,1) 62%)'
    const zenoImg = document.createElement('img')
    zenoImg.src = 'https://seeklogo.com/images/L/lilo-stitch-logo-42959E729E-seeklogo.com.png';
    zenoImg.style.width = '50px'
    zenoImg.style.height = '50px'
    const fraudSpan = document.querySelector('div.desktop-header-full-name> div.name');
    const firstFraudSpanChild = fraudSpan.childNodes[0]
    if(firstFraudSpanChild){
        fraudSpan.insertBefore(zenoImg,firstFraudSpanChild)
        firstFraudSpanChild.style.display = "none"
    }


    const secondChild = container.childNodes[1];
    if (secondChild) {
      container.insertBefore(img, secondChild);
    }
  } else {
    console.error(`Container not found: ${containerSelector}`);
  }


          }

      }else{
          console.log("nema nikoi")
      }
  }

})()
    document.addEventListener('keydown', handleKeyPress);
})();
