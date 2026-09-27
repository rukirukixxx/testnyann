const DATA_URL =
  "https://raw.githubusercontent.com/rukirukixxx/aikatuec-cardlist/main/data/20261008.json";


const cardList =
  document.getElementById("card-list");


// =========================
// JSONを読み込む
// =========================

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

    displayCards(cards);

  })


  .catch(error => {

    cardList.innerHTML =
      `<p>
        カードデータの読み込みに失敗しました。
      </p>`;

    console.error(error);

  });


// =========================
// カード一覧を表示
// =========================

function displayCards(cards) {

  cardList.innerHTML = "";


  const list =
    document.createElement("div");


  list.className =
    "card-list";


  cards.forEach(card => {

    const element =
      document.createElement("div");


    /*
      タイプによって
      cute / cool / sexy...
      のクラスを追加
    */

    element.className =
      `card ${getTypeClass(card.type)}`;


    element.innerHTML = `

      <div class="card-id">
        ${card.card_id}
      </div>


      <div class="card-name">
        ${card.name}
      </div>


      <div class="card-rarity">
        ${card.rarity}
      </div>


      <div class="card-category">
        ${card.category}
      </div>


      <div class="card-appeal">
        AP ${card.appeal_point}
      </div>


      <div class="card-brand">
        ${card.brand}
      </div>

    `;


    list.appendChild(element);

  });


  cardList.appendChild(list);

}


// =========================
// タイプ → CSSクラス
// =========================

function getTypeClass(type) {

  switch (type) {

    case "キュート":
      return "cute";


    case "クール":
      return "cool";


    case "セクシー":
      return "sexy";


    case "ポップ":
      return "pop";


    case "ナチュラル":
      return "natural";


    default:
      return "";

  }

}
