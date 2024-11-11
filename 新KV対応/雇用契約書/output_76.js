//ボタン作成
class Button {
  constructor(ledgerNames) {
    this.name = ledgerNames;
    this.ledgerNum = ledgerNames.length;
  }

  //ボタン作成の基本の型
  buttonMake(ledgerName, ledgerIndex) {
    const pButton = document.createElement("button");
    const target = document.getElementById("__next");
    pButton.innerHTML = ledgerName;
    pButton.classList.add("custom-button");
    pButton.style = `
      position: fixed; 
      right: 20px; 
      top: ${40 + 32 * ledgerIndex}px; 
      height: 30px; 
      width: 150px; 
      background-color: #00CCFF; 
      color: #fff; /* 白色の文字 */
      border-radius: 10px;
      font-size: 14px;
      z-index: 1000; /* スクロール時も表示 */
      cursor: pointer;
    `;
    if (ledgerIndex != this.ledgerNum) {
      pButton.setAttribute("id", ledgerName);
    } else {
      pButton.setAttribute("id", "close");
    }
    target.appendChild(pButton);
  }

  //ボタンの繰り返し作成
  repeatMake() {
    this.name.map((ledgerName) => {
      this.buttonMake(ledgerName, this.name.indexOf(ledgerName));
    });
    this.buttonMake("ウインドウを閉じる", this.ledgerNum);
  }
}

//クリック時のイベント
class ClickAction {
  buttonAction(displayHtml, ledgerNames) {
    for (let ledgerName of ledgerNames) {
      let pButton = document.getElementById(ledgerName);
      pButton.addEventListener("click", () => {
        let newTab = window.open("", "帳票", "_blank");
        newTab.document.getElementsByTagName("html")[0].innerHTML =
          displayHtml.get(ledgerName);
        this.createPrintButton(newTab);
        this.createCloseButton(newTab);
        const style = newTab.document.createElement("style");
        style.innerHTML = `
            @media print {
                #printButton, #closeButton {
                display: none;
                }
            }
            `;
        newTab.document.head.appendChild(style);
        newTab.oncontextmenu = function () {
          return false;
        };
        window.focus();
      });
      document.getElementById("close").addEventListener("click", function () {
        window.close();
      });
    }
  }
  createPrintButton(newTab) {
    const button = newTab.document.createElement("button");
    button.textContent = "印刷する";
    button.style.position = "fixed";
    button.style.alignContent = "center";
    button.style.width = "20%";
    button.style.right = "20px";
    button.style.height = "30px";
    button.style.top = "10px";
    button.id = "printButton";
    button.style.zIndex = 9999;
    button.addEventListener("click", function () {
      newTab.print();
    });
    newTab.document.body.appendChild(button);
  }
  createCloseButton(newTab) {
    const closeButton = newTab.document.createElement("button");
    closeButton.textContent = "ウインドウを閉じる";
    closeButton.style.alignContent = "center";
    closeButton.style.width = "20%";
    closeButton.style.right = "20px";
    closeButton.style.height = "30px";
    closeButton.style.position = "fixed";
    closeButton.style.top = "40px";
    closeButton.id = "closeButton";
    closeButton.style.zIndex = 9999;
    closeButton.addEventListener("click", function () {
      newTab.close();
    });
    newTab.document.body.appendChild(closeButton);
  }
}

class ChangeValue {
  functionsObject = {
    文字消去_1文字: function remove_oneword(i, value) {
      if (value[i].length > 0) {
        value[i] = value[i].slice(0, -1);
        return value;
      } else {
        return value;
      }
    },
    日付: function date_array(i, value, replace_data, cer_name) {
      if (replace_data.get(cer_name)["day_display"] == "YYYY年MM月DD日") {
        if (value[i] && value[i].trim() !== "") {
          let originalDateString = value[i];
          let originalDate = new Date(originalDateString);

          let year = originalDate.getFullYear();
          let month = originalDate.getMonth() + 1;
          let day = originalDate.getDate();
          let formattedDate = year + "年" + month + "月" + day + "日";
          value[i] = formattedDate;
          return value;
        } else {
          return value;
        }
      } else {
        return value;
      }
    },
    日付_年月のみ: function date_array(i, value, replace_data, cer_name) {
      if (replace_data.get(cer_name)["day_display"] == "YYYY年MM月DD日") {
        if (value[i] && value[i].trim() !== "") {
          let originalDateString = value[i];
          let originalDate = new Date(originalDateString);

          let year = originalDate.getFullYear();
          let month = originalDate.getMonth() + 1;
          let formattedDate = year + "年" + month + "月";
          value[i] = formattedDate;

          return value;
        } else {
          return value;
        }
      } else {
        if (value[i] && value[i].trim() !== "") {
          let originalDateString = value[i];
          let originalDate = new Date(originalDateString);

          let year = originalDate.getFullYear();
          let month = originalDate.getMonth() + 1;
          let formattedDate = year + "-" + month;
          value[i] = formattedDate;
          return value;
        } else {
          return value;
        }
      }
    },
    金額: function addCommasToValue(i, value) {
      if (!isNaN(value[i]) && value[i] !== "") {
        value[i] = parseFloat(value[i]).toLocaleString("en-US");
      }
      return value;
    },
    テーブル: function table_array(
      i,
      value,
      replace_data,
      cer_name,
      displayValue
    ) {
      let tablefield_name = replace_data.get(cer_name)["table_field"];
      let table = tablefield_name[0].replace(/^\{%|\%}$/g, "");
      let table_content = displayValue[table].value;
      let pp = 0;
      for (let jj = 0; jj < tablefield_name.length - 1; jj++) {
        if (tablefield_name[jj] == tablefield_name[jj + 1]) {
          pp += 1;
        } else {
          pp = 0;
        }
        if (table_content[pp]) {
          let name = tablefield_name[jj + 1].replace(/^\{%|\%}$/g, "");
          value[i + jj + 1] = table_content[pp].value[name].value;
        } else {
          value[i + jj + 1] = "";
        }
      }
      return value;
    },
  };
}

//replace作業
class ReplaceValue extends ChangeValue {
  constructor(template_array, replace_data, displayValue) {
    super();
    this.template_array = template_array;
    this.replace_data = replace_data;
    this.field_name_array = [];
    this.replace_value_array = [];
    this.kind_value_array = [];
    this.customer_value = [];
    this.display_html = new Map();
    this.displayValue = displayValue;
  }

  replaceGetValue(cer_name) {
    this.field_name_array = this.replace_data.get(cer_name)["field_name"];
    this.replace_value_array = this.replace_data.get(cer_name)["replace_value"];
    this.kind_value_array = this.replace_data.get(cer_name)["kind_value"];
    this.customer_value = [];

    for (let [index, element] of this.field_name_array.entries()) {
      this.customer_value[index] = replaceTemplate.call(this, element);
      function replaceTemplate(templateString) {
        // プレースホルダーを正規表現でマッチさせる
        return templateString.replace(/{%([^%]+)%}/g, (match, p1) => {
          // プレースホルダーからフィールド名を取得し、値に変換する
          const key = p1.trim();
          if (this.displayValue[key] && this.displayValue[key].value != null) {
            console.log(this.displayValue[key].value.replace(/\n/g, "<br>"));
            return this.displayValue[key].value.replace(/\n/g, "<br>");
          }
          return ""; // 値が存在しない場合は空文字を返す
        });
      }
    }

    for (let i = 0; i < this.customer_value.length; i++) {
      if (this.kind_value_array[i] != null && this.customer_value != "") {
        this.customer_value = this.functionsObject[
          `${this.kind_value_array[i]}`
        ](
          i,
          this.customer_value,
          this.replace_data,
          cer_name,
          this.displayValue
        );
      }
    }
  }

  replaceValueProcess(ledgerNames) {
    for (let ledgerName of ledgerNames) {
      this.replaceGetValue(ledgerName);
      for (let template of this.template_array) {
        if (template[0].indexOf(ledgerName) > -1) {
          for (let i = 0; i < this.replace_value_array.length; i++) {
            template[1] = template[1].replace(
              this.replace_value_array[i],
              this.customer_value[i]
            );
          }
          this.display_html.set(ledgerName, template[1]);
        }
      }
    }
    return this.display_html;
  }
}

const ENDPOINT = "https://kintone-relay-api-eidnwbgjma-an.a.run.app";

//リレーAPIで情報取得 replace_dataを返す
class Relay {
  constructor(appid, query_params, records) {
    this.appid = appid;
    this.records = records;
    this.query_params = query_params;
    this.data = null;
  }

  async RelayGetValue() {
    if (!JSON.parse(sessionStorage.getItem("getValue1"))) {
      const requestParam = {
        id: this.appid,
        query_params: this.query_params,
        fields: this.records,
      };

      try {
        const response = await fetch(ENDPOINT + "/getRecord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestParam),
        });

        if (!response.ok) {
          console.error("Error: ", await response.json());
          throw new Error("Network response was not ok");
        }

        this.data = await response.json();
        sessionStorage.setItem("getValue1", JSON.stringify(this.data));
        console.log(this.data); // レスポンスデータを処理
      } catch (error) {
        console.error("Error:", error); // エラーハンドリング
      }
    }
    this.data = JSON.parse(sessionStorage.getItem("getValue1"));
    return JSON.parse(sessionStorage.getItem("getValue1"));
  }

  async FileGetValue(ledgerNames, data) {
    let template_array = new Map();
    let file_records = data["records"];
    for (let e of file_records) {
      if (
        e["htmファイル"].value.length != 0 &&
        ledgerNames.includes(e["帳票名"].value)
      ) {
        const requestParam2 = {
          id: this.appid,
          file_key: e["htmファイル"].value[0].fileKey,
        };

        try {
          const response = await fetch(ENDPOINT + "/getFile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestParam2),
          });

          if (!response.ok) {
            console.error("Error: ", await response.blob());
            throw new Error("Network response was not ok");
          }

          let blob = await response.blob();
          let arrayBuffer = await blob.arrayBuffer();
          let decoder = new TextDecoder("shift-jis");
          let template = decoder.decode(arrayBuffer);
          // console.log(template); // レスポンスデータを処理
          template_array.set(e["帳票名"].value, template);
          // console.log(template_array);
        } catch (error) {
          console.error("Error:", error); // エラーハンドリング
        }
      }
    }
    let templateObject = Object.fromEntries(template_array.entries());
    sessionStorage.setItem("fileValues1", JSON.stringify(templateObject));
    return template_array;
  }

  GetRequireValue() {
    let data_records = JSON.parse(sessionStorage.getItem("getValue1"))[
      "records"
    ];
    const replace_data = new Map();
    for (let e of data_records) {
      let cer_name = e["帳票名"].value;
      let table_value = e["フィールド管理"].value;
      let day_display = e["日付の表示方法"].value;
      let field_name = [];
      let kind_value = [];
      let table_field = [];
      let replace_value = [];
      let replace_obj = {};

      for (let [index, element] of table_value.entries()) {
        let value_obj = element.value;
        field_name[index] = value_obj["フィールド名"].value;
        replace_value[index] = value_obj["置き換えるべき値"].value;
        kind_value[index] = value_obj["種類"].value;
        table_field[index] = value_obj["テーブル用フィールド"].value;
        replace_obj = {
          field_name: field_name,
          replace_value: replace_value,
          kind_value: kind_value,
          table_field: table_field,
          day_display: day_display,
        };
      }
      replace_data.set(cer_name, replace_obj);
    }
    return replace_data;
  }
}

(function () {
  "use strict";

  // let template_str = sessionStorage.getItem("template");
  // let template_array = JSON.parse(template_str);
  let template_array = new Map();
  const Params = new URLSearchParams(window.location.search);
  const companyId = Params.get("会社レコード番号");

  kviewer.events.on("record.show", function (state) {
    let displayValue = state.record.kintoneRecord;
    let ledgerNames = ["雇用契約書", "労働条件通知書"];
    const button = new Button(ledgerNames);

    const relay = new Relay(
      3851,
      [
        {
          key: "会社レコード番号",
          operator: "=",
          value: companyId,
        },
      ],
      ["帳票名", "フィールド管理", "日付の表示方法", "htmファイル"]
    );
    relay
      .RelayGetValue()
      .then((data) => {
        const storedValues = JSON.parse(sessionStorage.getItem("fileValues1"));
        if (storedValues) {
          const restoredTemplateArray = new Map(Object.entries(storedValues));
          return restoredTemplateArray;
        } else {
          return relay.FileGetValue(ledgerNames, data);
        }
      })
      .then((fileValues) => {
        template_array = fileValues;
        return button.repeatMake();
      })
      .then(() => {
        const replace_data = relay.GetRequireValue();
        const replace = new ReplaceValue(
          template_array,
          replace_data,
          displayValue
        );
        const displayHtml = replace.replaceValueProcess(ledgerNames);
        const action = new ClickAction();
        action.buttonAction(displayHtml, ledgerNames);
      })
      .catch((error) => {
        console.error(error);
      });
    return state;
  });

  kviewer.events.on("view.index.show", function (state) {
    const buttons = document.querySelectorAll(".custom-button"); // 特定のクラスを持つボタンを取得
    buttons.forEach((button) => button.remove()); // 各ボタンを削除
    return state;
  });
})();
