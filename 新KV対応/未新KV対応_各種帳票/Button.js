//ボタン作成
class Button {
  constructor(ledgerNames) {
    this.name = ledgerNames;
    this.ledgerNum = ledgerNames.length;
  }

  //ボタン作成の基本の型
  buttonMake(ledgerName, ledgerIndex) {
    const pButton = document.createElement("button");
    const target = document.getElementsByClassName("content")[0];
    pButton.style = `position: fixed; right:20px; top:${
      40 + 32 * ledgerIndex
    }px; height:30px; width:150px; visibility: hidden; z-index: -1;`;
    pButton.innerHTML = ledgerName;
    pButton.style.borderRadius = "10px";
    pButton.style.fontSize = "14px";
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
