// html,codeをsessionStorageから読み込む
// const Params = new URLSearchParams(window.location.search);
// const kindOfCertification = Params.get("帳票種別");
// const employeeId = Params.get("employeeId");
// const sei = Params.get("姓");
// const mei = Params.get("名");

const ENDPOINT = "https://kintone-relay-api-eidnwbgjma-an.a.run.app";

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

//リレーAPIで情報取得 replace_dataを返す
class Relay {
  constructor(appid, query_params, records) {
    this.appid = appid;
    this.records = records;
    this.query_params = query_params;
    this.data = null;
  }

  async RelayGetValue() {
    if (!JSON.parse(sessionStorage.getItem("getValue2"))) {
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
        sessionStorage.setItem("getValue2", JSON.stringify(this.data));
        // console.log(this.data); // レスポンスデータを処理
      } catch (error) {
        console.error("Error:", error); // エラーハンドリング
      }
    }
    this.data = JSON.parse(sessionStorage.getItem("getValue2"));
    return JSON.parse(sessionStorage.getItem("getValue2"));
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
          template_array.set(e["帳票名"].value, template);
        } catch (error) {
          console.error("Error:", error); // エラーハンドリング
        }
      }
    }
    let templateObject = Object.fromEntries(template_array.entries());
    sessionStorage.setItem("fileValues2", JSON.stringify(templateObject));
    return template_array;
  }

  GetRequireValue() {
    let data_records = JSON.parse(sessionStorage.getItem("getValue2"))[
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
    個別関数1: function original_function1(i, value, replace_data, cer_name) {
      let element1 = document.getElementsByClassName("kv-element-has-value");
      let tablefield_name = replace_data.get(cer_name)["table_field"];
      let index = 0;
      const mapping = {
        ア: { index: 1, value1: "１", value2: "①", value3: "ア" },
        イ: { index: 2, value1: "２", value2: "②", value3: "イ" },
        ウ: { index: 3, value1: "３", value2: "③", value3: "ウ" },
        エ: { index: 4, value1: "４", value2: "④", value3: "エ" },
        オ: { index: 5, value1: "５", value2: "⑤", value3: "オ" },
        カ: { index: 6, value1: "６", value2: "⑥", value3: "カ" },
        キ: { index: 7, value1: "７", value2: "⑦", value3: "キ" },
      };

      if (cer_name == "解雇理由証明書") {
        delete mapping["キ"];
      }

      for (var k = 0; k < element1.length; k++) {
        let element1Text = element1[k].firstElementChild.innerText.trim();
        if (element1Text == tablefield_name[i]) {
          let alphabet = element1[k].lastElementChild.innerText.trim();
          for (let key in mapping) {
            if (alphabet == key) {
              value[i + mapping[key].index] = mapping[key].value2;
              index = mapping[key].index;
            } else {
              value[i + mapping[key].index] = mapping[key].value1;
            }
          }
          if (cer_name == "解雇理由証明書") {
            value[i + 7] = index;
          }
        }
      }
      return value;
    },
    個別関数2: function original_function2(i, value, replace_data, cer_name) {
      let element1 = document.getElementsByClassName("kv-element-has-value");
      let tablefield_name = replace_data.get(cer_name)["table_field"];
      let index = value[i];
      let reasons = "";
      for (let k = 0; k < element1.length; k++) {
        let elementText1 = element1[k].firstElementChild.innerText.trim();
        if (elementText1 == tablefield_name[i]) {
          reasons = element1[k].lastElementChild.innerText.trim();
        }
      }
      if (reasons.length < 35) {
        value[i + 2 + (index - 1) * 3] = reasons;
      } else if (reasons.length < 53) {
        value[i + 1 + (index - 1) * 3] = reasons.substring(0, 10);
        value[i + 2 + (index - 1) * 3] = reasons.substring(11, reasons.length);
      } else {
        value[i + 1 + (index - 1) * 3] = reasons.substring(0, 10);
        value[i + 2 + (index - 1) * 3] = reasons.substring(11, 53);
        value[i + 3 + (index - 1) * 3] = reasons.substring(54, reasons.length);
      }

      value[i] = "";

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

// //replace作業
// class ReplaceValue extends ChangeValue {
//   constructor(template_array, replace_data) {
//     super();
//     this.template_array = template_array;
//     this.replace_data = replace_data;
//     this.field_name_array = [];
//     this.replace_value_array = [];
//     this.customer_value = [];
//     this.display_html = new Map();
//   }

//   replaceGetValue(cer_name) {
//     this.field_name_array = this.replace_data.get(cer_name)["field_name"];
//     this.replace_value_array = this.replace_data.get(cer_name)["replace_value"];
//     this.kind_value_array = this.replace_data.get(cer_name)["kind_value"];
//     this.customer_value = [];

//     let element1 = document.getElementsByClassName("kv-element-has-value");

//     for (let [index, element] of this.field_name_array.entries()) {
//       for (let ele of element1) {
//         let elementText = ele.firstElementChild.innerText.trim(); // .trim()でスペースや改行を削除
//         if (element === elementText) {
//           this.customer_value[index] = ele.lastElementChild.innerText.trim(); // .trim()でスペースや改行を削除
//           break;
//         }
//       }
//     }

//     for (let i = 0; i < this.customer_value.length; i++) {
//       if (this.customer_value[i] === undefined) {
//         this.customer_value[i] = "";
//       }
//       if (this.kind_value_array[i] != null && this.customer_value != "") {
//         this.customer_value = this.functionsObject[
//           `${this.kind_value_array[i]}`
//         ](i, this.customer_value, this.replace_data, cer_name);
//       }
//     }
//   }

//   replaceValueProcess(ledgerNames) {
//     for (let ledgerName of ledgerNames) {
//       this.replaceGetValue(ledgerName);
//       for (let template of this.template_array) {
//         if (template[0].indexOf(ledgerName) > -1) {
//           if (ledgerName == "退職証明書") {
//             template[1] = template[1].replace(
//               ">%e22%",
//               " id = cssstyle > （別紙の理由による）"
//             );
//           }
//           for (let i = 0; i < this.replace_value_array.length; i++) {
//             template[1] = template[1].replace(
//               this.replace_value_array[i],
//               this.customer_value[i]
//             );
//           }
//           this.display_html.set(ledgerName, template[1]);
//         }
//       }
//     }
//     return this.display_html;
//   }
// }

(function () {
  "use strict";

  // let template_str = sessionStorage.getItem("template");
  let template_array;
  // console.log(sessionStorage.getItem("template"));

  kv.events.view.detail.mounted.push(function (state) {
    // let mainElement = document.getElementsByTagName("main")[0];
    // if (mainElement) {
    //   mainElement.style.position = "absolute";
    //   mainElement.style.left = "-9999px";
    //   mainElement.style.top = "-9999px";
    //   mainElement.style.zIndex = "-1";
    // }
    let ledgerNames = [
      "在籍証明書",
      "労働者名簿",
      "辞令",
      "退職証明書",
      "解雇理由証明書",
    ];
    const button = new Button(ledgerNames);

    const relay = new Relay(
      3701,
      {
        // key: "帳票名",
        // operator: "=",
        // value: ledgerNames,
      },
      ["帳票名", "フィールド管理", "日付の表示方法", "htmファイル"]
    );
    relay
      .RelayGetValue()
      .then((data) => {
        const storedValues = JSON.parse(sessionStorage.getItem("fileValues2"));
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
        const replace = new ReplaceValue(template_array, replace_data);
        const displayHtml = replace.replaceValueProcess(ledgerNames);
        sessionStorage.setItem("template", displayHtml);
        // console.log(sessionStorage.getItem("template"));
        const action = new ClickAction();
        action.buttonAction(displayHtml, ledgerNames);
      })
      .then(() => {
        let count = 2;
        const maxCount = 30;
        const interval = 100;
        const intervalId = setInterval(() => {
          let pButton = document.getElementById(kindOfCertification);
          if (pButton) {
            pButton.click();
            clearInterval(intervalId); // ボタンがクリックできたらループを終了
          } else {
            console.error("Button not found");
          }
          count++;
          if (count >= maxCount) {
            clearInterval(intervalId); // 最大回数に達したらループを終了
          }
        }, interval);
      })
      .catch((error) => {
        console.error(error);
      });
    return state;
  });
})();
