(function () {
  "use strict";
  fb.events.kviewer.records.mounted = [
    function (state) {
      state.record.生年月日_在籍.value = ChangeBornDate(
        state.record.生年月日_在籍_copy.value
      );
      console.log(state.record.生年月日_在籍_copy.value);
      state.record.生年月日_労働者名簿.value = ChangeBornDate(
        state.record.生年月日_労働_copy.value
      );

      function ChangeBornDate(originalValue) {
        if (originalValue.length === 8) {
          let formattedValue =
            originalValue.slice(0, 4) +
            "-" + // 年 (1999)
            originalValue.slice(4, 6) +
            "-" + // 月 (01)
            originalValue.slice(6, 8); // 日 (01)

          return formattedValue;
        }
      }
    },
  ];
})();
