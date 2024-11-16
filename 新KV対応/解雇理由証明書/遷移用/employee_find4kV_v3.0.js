(function () {
  "use strict";

  const LOCATED_URL = new URL(window.location.href);
  const PARAMS = LOCATED_URL.searchParams; //渡したパラメータを取得

  // kV/FB連携時のレコード一覧ビューの表示を消す
  kviewer.events.on("view.index.show", function (state) {
    document.getElementById("__next").style.display = "none";
    //    console.log("view.indexl.show in");
    return state;
  });

  // kV/FB連携時のレコード一覧から選択された社員レコードを特定し、詳細ボタンを自動クリックする
  kviewer.events.on("records.show", function (state) {
    document.getElementById("__next").style.display = "none";
    // console.log("records.show in");
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
      familyName = PARAMS.get("familyName");
      givenName = PARAMS.get("givenName");

      const elem = state.getRecordElements(); // レコード一覧のNodeListを取得する
      let find_flag = false;
      let attemptCount = 0; // 試行回数のカウンタ

      // 最大試行回数
      const maxAttempts = 10;

      function tryFindEmployee() {
        if (attemptCount < maxAttempts && !find_flag) {
          attemptCount++;
          for (let i = 0; i < elem.length; i++) {
            const tr_elem = elem.item(i);
            const empNo = tr_elem.querySelector(
              '[data-field-code="社員No"]'
            ).textContent;
            const empFamily = tr_elem.querySelector(
              '[data-field-code="労働者氏_全体"]'
            ).textContent;
            const empGiven = tr_elem.querySelector(
              '[data-field-code="労働者名_全体"]'
            ).textContent;

            if (employeeId !== "") {
              if (empNo === employeeId) {
                const kv_text_action = tr_elem.getElementsByTagName("button");
                kv_text_action[0].click();
                find_flag = true;
                console.log("kv_text_action click", kv_text_action);
                break;
              }
            } else {
              if (empFamily === familyName && empGiven === givenName) {
                const kv_text_action = tr_elem.getElementsByTagName("button");
                kv_text_action[0].click();
                find_flag = true;
                break;
              }
            }
          }

          if (!find_flag) {
            console.log(`Attempt ${attemptCount} failed. Retrying...`);
            setTimeout(tryFindEmployee, 100); // 100ミリ秒後に再試行
          }
        } else {
          if (!find_flag) {
            const url = `https://916163bf.form.kintoneapp.com/public/nkrfsv2-8-kv-cerificationprint-3218-999?社員No=${PARAMS.get(
              "employeeId"
            )}&帳票種別=解雇理由証明書`;
            window.location.href = url;
            throw new Error(
              "Not found employee in kV-list after " + maxAttempts + " attempts"
            );
          }
        }
      }

      tryFindEmployee(); // 最初の試行を開始
    } catch (e) {
      console.error("employee find error: ", e.message);
      //   alert("該当する社員データがありません");
      //   window.close();
    }
  }

  let SEARCH_PENCIL_ICON;
  // kV/FB連携時のレコード詳細ビューの表示を消す
  kviewer.events.on("view.detail.show", function (state) {
    document.getElementById("__next").style.display = "none";
    //    console.log("view.detail.show in");
    return state;
  });

  // kV/FB連携時、社員レコード詳細の編集ボタンを自動クリックする
  kviewer.events.on("record.show", function (state) {
    //    console.log("record.show in");
    //    if ((state.kintoneRecord.社員No.value !== employeeId) ||
    //        (state.kintoneRecord.姓戸籍.value !== familyName) ||
    //        (state.kintoneRecord.名戸籍.value !== givenName)) {
    //        alert("該当するデータがありません");
    //        window.close();
    //    }
    search_pencil_icon();
    return state;
  });

  async function search_pencil_icon() {
    /* 自動的にKVの編集ボタンを押す処理 */
    try {
      //        console.log("search pencil in");

      const pencilIcon =
        document.getElementsByClassName("border-role-action")[0];
      if (pencilIcon === undefined) {
        //            SEARCH_PENCIL_ICON = setInterval(search_pencil_icon, 100);
        throw new Error("not loaded edit button yet");
      } else {
        clearInterval(SEARCH_PENCIL_ICON); //非同期処理を削除
      }
      /* 青い編集アイコンをクリック */
      //        console.log("found pencil ico and click it", pencilIcon);
      pencilIcon.click();
      return;
    } catch (e) {
      console.error(e.message);
      alert("該当する社員データがありません");
      window.close();
    }
  }
})();
