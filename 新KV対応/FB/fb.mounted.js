let url = new URL(window.location.href);
let params = url.searchParams;
fb.events.form.mounted.push(function (state) {
  const parentCode = params.get("__kViewerViewCode__");
  if (params.get("__kViewerViewCode__")) {
    const URLobj = {
      "retirement-certification-views-999-newkv-for-clients-transition":
        "退職証明書",
      "dismissal-certification-views-999-newkv-for-clients-transition":
        "解雇理由証明書",
      "appointment-letter-views-999-newkv-for-clients-transition": "辞令",
      "worker-list-views-999-newkv-for-clients-transition": "労働者名簿",
    };
    state.record.帳票種別.value = URLobj[parentCode];
  } else {
    state.record.帳票種別.value = params.get("帳票種別");
  }
});
