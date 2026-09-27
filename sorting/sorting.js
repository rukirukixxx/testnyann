const DATA_URL =
  "https://raw.githubusercontent.com/rukirukixxx/aikatuec-cardlist/main/data/20261008.json";


let allCards = [];

let selectedSeries = null;
let selectedRarity = null;
let selectedType = null;
let selectedCategory = null;


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

  .then(cards => {

    allCards = cards;

    createFilterButtons();

    displayCards();

  })

  .catch(error => {

    cardList.innerHTML = `
      <div class="no-results">
        カードデータの読み込みに失敗しました
      </div>
    `;

    console.error(error);

  });


/* =========================
   フィルターボタン
========================= */

function createFilterButtons() {

  createButtons(
    seriesButtons,

    getUniqueValues(
      allCards,
      "series_title"
    ),

    value => {

      selectedSeries =
        selectedSeries === value
          ? null
          : value;

      updateButtons();
      displayCards();

    }
  );


  /* レアリティ */

  createButtons(

    rarityButtons,

    [
      "N",
      "R",
      "PR",
      "ER"
    ],

    value => {

      selectedRarity =
        selectedRarity === value
          ? null
          : value;

      updateButtons();
      displayCards();

    }

  );


  /* タイプ */

  const types =
    getUniqueValues(
      allCards,
      "type"
    )
    .filter(type => {

      return (
        type === "キュート" ||
        type === "クール" ||
        type === "セクシー" ||
        type === "ポップ"
      );

    });


  createButtons(

    typeButtons,

    types,

    value => {

      selectedType =
        selectedType === value
          ? null
          : value;

      updateButtons();
      displayCards();

    }

  );


  /* カテゴリ */

  const categories =
    getUniqueValues(
      allCards,
      "category"
    )
    .filter(category => {

      return (
        category !== "スカート" &&
        category !== "ブーツ"
      );

    });


  createButtons(

    categoryButtons,

    categories,

    value => {

      selectedCategory =
        selectedCategory === value
          ? null
          : value;

      updateButtons();
      displayCards();

    }

  );

}


/* =========================
   ボタン生成
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

    button.dataset.value =
      value;


    button.addEventListener(
      "click",
      () => {

        onClick(value);

      }
    );


    container.appendChild(button);

  });

}


/* =========================
   選択状態
========================= */

function updateButtons() {

  updateButtonGroup(
    seriesButtons,
    selectedSeries
  );

  updateButtonGroup(
    rarityButtons,
    selectedRarity
  );

  updateButtonGroup(
    typeButtons,
    selectedType
  );

  updateButtonGroup(
    categoryButtons,
    selectedCategory
  );

}


function updateButtonGroup(
  container,
  selected
) {

  const buttons =
    container.querySelectorAll(
      ".filter-button"
    );


  buttons.forEach(button => {

    button.classList.toggle(
      "active",

      button.dataset.value ===
        selected

    );

  });

}


/* =========================
   絞り込み
========================= */

function displayCards() {

  const keyword =
    nameSearch.value
      .trim()
      .toLowerCase();


  const filtered =
    allCards.filter(card => {

      const matchesName =
        !keyword ||
        String(card.name)
          .toLowerCase()
          .includes(keyword);


      const matchesSeries =
        !selectedSeries ||
        card.series_title ===
          selectedSeries;


      /*
        PRを選択
        → PRとPR★

        ERを選択
        → ERとER★

        N / R
        → そのまま
      */

      const matchesRarity =
        !selectedRarity ||

        card.rarity ===
          selectedRarity ||

        (
          selectedRarity === "PR" &&
          card.rarity === "PR★"
        ) ||

        (
          selectedRarity === "ER" &&
          card.rarity === "ER★"
        );


      const matchesType =
        !selectedType ||
        card.type === selectedType;


      const matchesCategory =
        !selectedCategory ||
        card.category === selectedCategory;


      return (
        matchesName &&
        matchesSeries &&
        matchesRarity &&
        matchesType &&
        matchesCategory
      );

    });


  renderCards(filtered);

}


/* =========================
   カード表示
========================= */

function renderCards(cards) {

  cardList.innerHTML = "";

  resultCount.textContent =
    `${cards.length}枚`;


  if (cards.length === 0) {

    cardList.innerHTML = `
      <div class="no-results">
        条件に一致するカードがありません
      </div>
    `;

    return;

  }


  cards.forEach(card => {

    const element =
      document.createElement("div");


    /*
      ここでCSS用クラスを付ける

      rarity-pr
      rarity-er
      rarity-r
      rarity-n

      type-cute
      type-cool
      type-sexy
      type-pop
    */

    const rarityClass =
      getRarityClass(card.rarity);

    const typeClass =
      getTypeClass(card.type);


    element.className =
      `card ${rarityClass} ${typeClass}`;


    const isParallel =
      card.variant === "parallel";


    const appeal =
      card.appeal_point !== undefined &&
      card.appeal_point !== null
        ? `AP ${card.appeal_point}`
        : "";


    element.innerHTML = `

      <div class="card-id">
        ${escapeHTML(card.card_id)}
      </div>


      <div class="card-name">
        ${escapeHTML(card.name)}
      </div>


      <div class="card-info">

        <span
          class="card-tag rarity-${getRarityTagClass(card.rarity)}"
        >
          ${escapeHTML(card.rarity)}
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


        ${
          typeClass
            ? `
              <span class="card-tag ${typeClass}">
                ${escapeHTML(card.type)}
              </span>
            `
            : ""
        }


        <span class="card-tag">
          ${escapeHTML(card.category)}
        </span>


        ${
          appeal
            ? `
              <span class="card-tag appeal">
                ${escapeHTML(appeal)}
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
   レアリティ
========================= */

function getRarityClass(rarity) {

  if (
    rarity === "PR" ||
    rarity === "PR★"
  ) {
    return "rarity-pr";
  }


  if (
    rarity === "ER" ||
    rarity === "ER★"
  ) {
    return "rarity-er";
  }


  if (rarity === "R") {
    return "rarity-r";
  }


  return "rarity-n";

}


function getRarityTagClass(rarity) {

  if (
    rarity === "PR" ||
    rarity === "PR★"
  ) {
    return "pr";
  }


  if (
    rarity === "ER" ||
    rarity === "ER★"
  ) {
    return "er";
  }


  if (rarity === "R") {
    return "r";
  }


  return "n";

}


/* =========================
   タイプ
========================= */

function getTypeClass(type) {

  switch (type) {

    case "キュート":
      return "type-cute";

    case "クール":
      return "type-cool";

    case "セクシー":
      return "type-sexy";

    case "ポップ":
      return "type-pop";

    default:
      return "";

  }

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
   重複削除
========================= */

function getUniqueValues(
  cards,
  key
) {

  return [
    ...new Set(

      cards
        .map(card => card[key])
        .filter(Boolean)

    )
  ];

}


/* =========================
   HTMLエスケープ
========================= */

function escapeHTML(value) {

  return String(value ?? "")

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}
