

fb.events.form.mounted.push(function (state) {
   let url = new URL(window.location.href);
   let params = url.searchParams;
   console.log("kViewerViewCode is ", params.get('__kViewerViewCode__'));
   console.log("kViewerRecordCode is ", params.get('__kViewerRecordCode__'));

});
