(function () {
  "use strict";
  fb.events.finish.mounted = [
    function (state) {
      const reportType = state.record.帳票種別.value;
      const employeeId = state.record.社員No.value;
      const sei = state.record.姓.value;
      const mei = state.record.名.value;
      const companyId = state.record.会社レコード番号.value;

      const baseUrl = {
        在籍証明書: "https://example.com/viewerA",
        辞令: "https://5ea2a167.viewer.kintoneapp.com/public/nkrfs28-appointment-letter-kv",
        労働者名簿:
          "https://5ea2a167.viewer.kintoneapp.com/public/nkrfs28-worker-list-kv",
        退職証明書:
          "https://5ea2a167.viewer.kintoneapp.com/public/nkrfs28-retirement-certificate-kv",
        解雇理由証明書:
          "https://5ea2a167.viewer.kintoneapp.com/public/nkrfs28-dismissal-certificate-kv",
      };

      // reportTypeに基づいてURLを生成
      const url =
        baseUrl[reportType] +
        `?employeeId=${employeeId}&姓=${sei}&名=${mei}&会社レコード番号=${companyId}`;

      // ボタン要素を動的に作成
      const buttonContainer = document.getElementById("messageContainer");

      // 「はい、閲覧・印刷します」ボタン
      const printButton = document.createElement("button");
      printButton.textContent = "はい、閲覧・印刷します";
      printButton.classList.add("button"); // 必要に応じてスタイルを追加
      printButton.onclick = function () {
        window.location.href = url; // 生成したURLに遷移
      };
      buttonContainer.appendChild(printButton); // ボタンをdivに追加

      // 「いいえ」ボタン
      const closeButton = document.createElement("button");
      closeButton.textContent = "いいえ";
      closeButton.onclick = function () {
        window.close(); // 閉じるボタンの動作
      };
      buttonContainer.appendChild(closeButton); // ボタンをdivに追加
    },
  ];
})();
