class ClickAction {
  constructor() {
    this.DoubleLineflag = false;
  }
  buttonAction(displayHtml, ledgerNames) {
    for (let ledgerName of ledgerNames) {
      this.drawDoubleLine1(ledgerName);
      let pButton = document.getElementById(ledgerName);
      // console.log(pButton);
      pButton.addEventListener("click", () => {
        document.getElementsByTagName("html")[0].innerHTML =
          displayHtml.get(ledgerName);
        this.createPrintButton();
        this.createCloseButton();
        this.drawDoubleLine2(ledgerName);
        const style = document.createElement("style");
        style.innerHTML = `
            @media print {
                #printButton, #closeButton {
                display: none;
                }
            }
            `;
        document.head.appendChild(style);
        oncontextmenu = function () {
          return false;
        };
        window.focus();
      });
      document.getElementById("close").addEventListener("click", function () {
        window.close();
      });
    }
  }
  createPrintButton() {
    const button = document.createElement("button");
    button.textContent = "印刷する";
    button.style.position = "fixed";
    button.style.alignContent = "center";
    button.style.width = "20%";
    button.style.right = "20px";
    button.style.height = "30px";
    button.style.top = "10px";
    button.style.zIndex = 9999;
    button.id = "printButton";
    button.addEventListener("click", function () {
      window.print();
    });
    document.body.appendChild(button);
  }
  createCloseButton() {
    const closeButton = document.createElement("button");
    closeButton.textContent = "ウインドウを閉じる";
    closeButton.style.alignContent = "center";
    closeButton.style.width = "20%";
    closeButton.style.right = "20px";
    closeButton.style.height = "30px";
    closeButton.style.position = "fixed";
    closeButton.style.top = "40px";
    closeButton.style.zIndex = 9999;
    closeButton.id = "closeButton";
    closeButton.addEventListener("click", function () {
      window.close();
    });
    document.body.appendChild(closeButton);
  }

  drawDoubleLine1(ledgerName) {
    if (ledgerName == "退職証明書") {
      let element1 = document.getElementsByClassName("kv-element-has-value");
      for (let ele of element1) {
        let elementText = ele.firstElementChild.innerText.trim();
        if (elementText == "労働者が解雇理由を請求するか") {
          if (ele.lastElementChild.innerText == "解雇理由を請求しない") {
            this.DoubleLineflag = true;
            break;
          }
        }
      }
    }
  }
  drawDoubleLine2(ledgerName) {
    // console.log(this.DoubleLineflag);
    if (ledgerName == "退職証明書" && this.DoubleLineflag == true) {
      let element = document.getElementById("cssstyle");
      element.style.textDecoration = "line-through";
      element.style.textDecorationColor = "black";
      element.style.textDecorationStyle = "double";
      // console.log(element);
    }
  }
}
