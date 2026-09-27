const DATA_URL =
  "https://raw.githubusercontent.com/rukirukixxx/aikatuec-cardlist/main/data/20261008.json";


/* =========================
   状態
========================= */

let cards = [];

let selectedSeries = null;
let selectedRarity = null;
let selectedType = null;
let selectedCategory = null;


/* =========================
   DOM
========================= */

const nameSearch =
  document.getElementById("name-search");

const seriesButtons =
  document.getElementById("series-buttons");

const rarityButtons =
  document.getElementById("rarity-buttons");

const typeButtons =
  document.getElementById("type-buttons");

const categoryButtons =
  document.getElementById("category-buttons");

const cardList =
  document.getElementById("card-list");

const resultCount =
  document.getElementById("result-count");


/* =========================
   JSON読み込み
========================= */

fetch(DATA_URL)

  .then(response => {

    if (!response.ok) {
      throw new Error(
        "カードデータを読み込めませんでした。"
      );
    }

    return response.json();

  })

  .then(data => {

    cards = data;

    createFilterButtons();

    displayCards();

  })

  .catch(error => {

    cardList.innerHTML = `
      <div class="no-results">
        カードデータの読み込みに失敗しました。
      </div>
    `;

    console.error(error);

  });


/* =========================
   ボタン生成
========================= */

function createFilterButtons() {

  createButtons(
    seriesButtons,
    getUniqueValues(cards, "series_title"),
    value => {

      selectedSeries =
        selectedSeries === value
          ? null
          : value;

      updateButtonState(
        seriesButtons,
        selectedSeries
      );

      displayCards();

    }
  );


  /* レアリティは固定 */

  createButtons(
    rarityButtons,
    ["N", "R", "PR", "ER"],
    value => {

      selectedRarity =
        selectedRarity === value
          ? null
          : value;

      updateButtonState(
        rarityButtons,
        selectedRarity
      );

      displayCards();

    }
  );


  createButtons(
    typeButtons,
    getUniqueValues(cards, "type"),
    value => {

      selectedType =
        selectedType === value
          ? null
          : value;

      updateButtonState(
        typeButtons,
        selectedType
      );

      displayCards();

    }
  );


  createButtons(
    categoryButtons,
    getUniqueValues(cards, "category"),
    value => {

      selectedCategory =
        selectedCategory === value
          ? null
          : value;

      updateButtonState(
        categoryButtons,
        selectedCategory
      );

      displayCards();

    }
  );

}


/* =========================
   ボタンを作る
========================= */

function createButtons(
  container,
  values,
  onClick
) {

  container.innerHTML = "";

  values.forEach(value => {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      "filter-button";

    button.textContent =
      value;

    button.addEventListener(
      "click",
      () => onClick(value)
    );

    container.appendChild(button);

  });

}


/* =========================
   ユニークな値
========================= */

function getUniqueValues(
  data,
  key
) {

  return [
    ...new Set(
      data
        .map(card => card[key])
        .filter(Boolean)
    )
  ];

}


/* =========================
   ボタンの選択状態
========================= */

function updateButtonState(
  container,
  selectedValue
) {

  const buttons =
    container.querySelectorAll(
      ".filter-button"
    );

  buttons.forEach(button => {

    button.classList.toggle(
      "active",
      button.textContent === selectedValue
    );

  });

}


/* =========================
   レアリティ判定
========================= */

function matchRarity(
  cardRarity,
  selectedRarity
) {

  if (selectedRarity === "PR") {

    return (
      cardRarity === "PR" ||
      cardRarity === "PR★"
    );

  }


  if (selectedRarity === "ER") {

    return (
      cardRarity === "ER" ||
      cardRarity === "ER★"
    );

  }


  return cardRarity === selectedRarity;

}


/* =========================
   カードを絞り込む
========================= */

function getFilteredCards() {

  const searchText =
    nameSearch.value
      .trim()
      .toLowerCase();


  return cards.filter(card => {

    /* 名前 */

    if (
      searchText &&
      !card.name
        .toLowerCase()
        .includes(searchText)
    ) {

      return false;

    }


    /* 弾 */

    if (
      selectedSeries &&
      card.series_title !== selectedSeries
    ) {

      return false;

    }


    /* レアリティ */

    if (
      selectedRarity &&
      !matchRarity(
        card.rarity,
        selectedRarity
      )
    ) {

      return false;

    }


    /* タイプ */

    if (
      selectedType &&
      card.type !== selectedType
    ) {

      return false;

    }


    /* カテゴリ */

    if (
      selectedCategory &&
      card.category !== selectedCategory
    ) {

      return false;

    }


    return true;

  });

}


/* =========================
   カード表示
========================= */

function displayCards() {

  const filteredCards =
    getFilteredCards();


  resultCount.textContent =
    `${filteredCards.length}枚`;


  cardList.innerHTML = "";


  if (filteredCards.length === 0) {

    cardList.innerHTML = `
      <div class="no-results">
        条件に一致するカードがありません。
      </div>
    `;

    return;

  }


  filteredCards.forEach(card => {

    const element =
      document.createElement("div");

    element.className = "card";


    const isParallel =
      card.variant === "parallel";


    element.innerHTML = `

      <div class="card-id">
        ${escapeHTML(card.card_id)}
      </div>

      <div class="card-name">
        ${escapeHTML(card.name)}
      </div>

      <div class="card-info">

        <span class="card-tag rarity">
          ${escapeHTML(card.rarity)}
        </span>

        <span class="card-tag">
          ${escapeHTML(card.type)}
        </span>

        <span class="card-tag">
          ${escapeHTML(card.category)}
        </span>

        ${
          isParallel
            ? `
              <span class="card-tag parallel">
                パラレル
              </span>
            `
            : ""
        }

      </div>

      <div class="card-brand">
        ${escapeHTML(card.brand)}
      </div>

    `;


    cardList.appendChild(element);

  });

}


/* =========================
   名前検索
========================= */

nameSearch.addEventListener(
  "input",
  () => {

    displayCards();

  }
);


/* =========================
   HTMLエスケープ
========================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
