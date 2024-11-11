const LOCATED_URL = new URL(window.location.href);
const PARAMS = LOCATED_URL.searchParams; //渡したパラメータを取得
const companyId = PARAMS.get("会社レコード番号");

(function () {
  ("use strict");

  // ロード画面を表示する関数
  function showLoadingScreen() {
    // ロード画面のスタイル
    const styles = `
    .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .hourglass {
      font-size: 48px;
      animation: spin 1.5s infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

    // スタイルをheadに追加
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // ロード画面のdiv要素を作成
    const loadingScreen = document.createElement("div");
    loadingScreen.className = "loading-screen";

    // 砂時計アイコンを作成
    const hourglass = document.createElement("div");
    hourglass.className = "hourglass";
    hourglass.innerHTML = "⌛";

    // ロード画面に砂時計を追加
    loadingScreen.appendChild(hourglass);

    // bodyにロード画面を追加
    document.body.appendChild(loadingScreen);
  }

  showLoadingScreen();

  // kV/FB連携時のレコード一覧ビューの表示を消す
  kviewer.events.on("view.index.show", function (state) {
    document.getElementById("__next").style.display = "none";
    //    console.log("view.indexl.show in");
    return state;
  });

  // kV/FB連携時のレコード一覧から選択された社員レコードを特定し、詳細ボタンを自動クリックする
  kviewer.events.on("records.show", function (state) {
    //    console.log("records.show in");
    match_employee(state);
    return state;
  });

  let employeeId;
  let familyName;
  let givenName;

  function match_employee(state) {
    /* 社員番号と該当するレコードを探索。非同期処理。 */
    try {
      if (state.records.length === 0) {
        throw new Error("no employee data in kV-list");
      }
      employeeId = PARAMS.get("employeeId");
      familyName = PARAMS.get("姓");
      givenName = PARAMS.get("名");

      /* 社員番号と該当したレコードリンクに遷移 */
      const elem = state.getRecordElements(); //　レコード一覧のNodeListを取得する
      let find_flag = false;
      for (let i = 0; i < elem.length; i++) {
        const tr_elem = elem.item(i);
        const empNo = tr_elem.querySelector(
          '[data-field-code="社員No"]'
        ).textContent;
        const empFamily = tr_elem.querySelector(
          '[data-field-code="労働者氏"]'
        ).textContent;
        const empGiven = tr_elem.querySelector(
          '[data-field-code="労働者名"]'
        ).textContent;
        console.log("Analysis of ", empNo, empFamily, empGiven);
        if (employeeId !== "") {
          if (empNo === employeeId) {
            const kv_text_action = tr_elem.getElementsByTagName("button");
            kv_text_action[0].click();
            find_flag = true;
            //                    console.log("kv_text_action click", kv_text_action);
            break;
          }
        } else {
          if (empFamily === familyName && empGiven === givenName) {
            const kv_text_action = tr_elem.getElementsByTagName("button");
            kv_text_action[0].click();
            find_flag = true;
            //                    console.log("kv_text_action click", kv_text_action);
            break;
          }
        }
      }
      if (find_flag === false) {
        throw new Error("Not found employee in kV-list");
      }
      return;
    } catch (e) {
      console.error("employee find error: ", e.message);
      alert("該当する社員データがありません");
      window.close();
    }
  }
})();
