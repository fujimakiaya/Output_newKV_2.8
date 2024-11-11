(function () {
  "use strict";

  fb.addValidators = function (state) {
    return {
      full_width_checker: {
        getMessage: function (fieldCode, params) {
          return "全角入力してください";
        },
        validate: function (value, params) {
          if (!value.match(/^[^\x01-\x7E\xA1-\xDF]+$/)) {
            return false;
          }
          return true;
        },
      },
      after_date_checker: {
        getMessage: function (fieldCode, params) {
          return "生年月日より後の日付を入力してください";
        },
        validate: function (value, params) {
          if (value < state.record.生年月日_在籍.value) {
            return false;
          }
          return true;
        },
      },
      after_enter_date_checker: {
        getMessage: function (fieldCode, params) {
          return "入社年月日より後の日付を入力してください";
        },
        validate: function (value, params) {
          if (value <= state.record.入社年月日_在籍.value) {
            return false;
          }
          return true;
        },
      },
      address_number_checker: {
        getMessage: function (fieldCode, params) {
          return "ハイフンありの8文字で入力してください";
        },
        validate: function (value, params) {
          if (value.length != 8 || value.indexOf("-") == -1) {
            return false;
          }
          return true;
        },
      },
      // regislation_checker: {
      //   getMessage: function (fieldCode, params) {
      //     return "退職される日よりも前に退職証明書・解雇理由証明書を作成することはできません";
      //   },
      //   validate: function (value, params) {
      //     if (value === "退職証明書" || value === "解雇理由証明書") {
      //       if (
      //         !state.record.退職日_退職証明.value ||
      //         state.record.退職日_退職証明.value < state.record.アクセス日.value
      //       ) {
      //         return false;
      //       }
      //     }
      //     return true;
      //   },
      // },
      content_checker: {
        getMessage: function (fieldCode, params) {
          return "内容は全角65文字以内で記載してください";
        },
        validate: function (value, params) {
          if (value.length > 64 || !value.match(/^[^\x01-\x7E\xA1-\xDF]+$/)) {
            return false;
          }
          return true;
        },
      },
      phone_number_checker: {
        getMessage: function (fieldCode, params) {
          return "ハイフンありの12文字又は13文字で入力してください 例000-0000-0000";
        },
        validate: function (value, params) {
          if (
            (value.length != 12 && value.length != 13) ||
            value.indexOf("-") == -1
          ) {
            return false;
          }
          return true;
        },
      },
    };
  };

  fb.events.form.created = [
    function (state) {
      //在職証明書
      state.fields
        .filter(function (field) {
          return field.code === "住所_在籍";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "在職証明書に記載する事項_在籍";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "証明者所在地_在籍";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "代表者氏名_在籍";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      //辞令
      state.fields
        .filter(function (field) {
          return field.code === "辞令の内容";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "代表者氏名_辞令";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "辞令日付";
        })[0]
        .validations.push({
          params: [],
          rule: "after_enter_date_checker",
        });
      //労働者名簿
      state.fields
        .filter(function (field) {
          return field.code === "退職又は死亡年月日_労働者名簿";
        })[0]
        .validations.push({
          params: [],
          rule: "after_enter_date_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "郵便番号_労働者名簿";
        })[0]
        .validations.push({
          params: [],
          rule: "address_number_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "電話番号_労働者名簿";
        })[0]
        .validations.push({
          params: [],
          rule: "phone_number_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "住所_労働者名簿";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "住所フリガナ_労働者名簿";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "所属_労働者名簿";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "退職または死亡事由_労働者名簿";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "労働者名簿_備考";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      // //退職証明書
      // state.fields
      //   .filter(function (field) {
      //     return field.code === "帳票種別";
      //   })[0]
      //   .validations.push({
      //     params: [],
      //     rule: "regislation_checker",
      //   });
      state.fields
        .filter(function (field) {
          return field.code === "使用者職氏名_退職証明";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "具体的な理由_退職証明";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      //解雇理由証明書
      state.fields
        .filter(function (field) {
          return field.code === "使用者職氏名_解雇理由";
        })[0]
        .validations.push({
          params: [],
          rule: "full_width_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "具体的な理由_ア";
        })[0]
        .validations.push({
          params: [],
          rule: "content_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "具体的な理由_イ";
        })[0]
        .validations.push({
          params: [],
          rule: "content_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "具体的な理由_ウ";
        })[0]
        .validations.push({
          params: [],
          rule: "content_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "具体的な理由_エ";
        })[0]
        .validations.push({
          params: [],
          rule: "content_checker",
        });
      state.fields
        .filter(function (field) {
          return field.code === "具体的な理由_オ";
        })[0]
        .validations.push({
          params: [],
          rule: "content_checker",
        });

      return state;
    },
  ];
})();
