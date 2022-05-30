function dateOffset(date, offsetY, offsetM, offsetD) {
  var y = date.getFullYear() + (offsetY || 0);
  var m = date.getMonth() + (offsetM || 0);
  var d = date.getDate() + (offsetD || 0);
  if (y < 0 || y > 99) {
    return new Date(y, m, d);
  } else {  // 年份介於 0 ~ 99 必須用 setFullYear()
    var base = new Date(0, 0, 1);
    return new Date(new Date(new Date(base.setFullYear(y)).setMonth(m)).setDate(d));
  }
}

// 通用日期算法
export const CDate = {
  firstDate: d => new Date(d.getFullYear(), d.getMonth(), 1),
  lastDate: d => new Date(d.getFullYear(), d.getMonth() + 1, 0),

  firstMonth: d => new Date(d.getFullYear(), 0, 1),
  lastMonth: d => new Date(d.getFullYear(), 11, 1),

  getDate: d => new Date(d.getFullYear(), d.getMonth(), d.getDate()),
  getMonth: d => new Date(d.getFullYear(), d.getMonth(), 1),
  getYear: d => new Date(d.getFullYear(), 0, 1),

  offsetDate: (d, offset) => dateOffset(d, 0, 0, offset),
  offsetMonth: (d, offset) => dateOffset(d, 0, offset, 0),
  offsetYear: (d, offset) => dateOffset(d, offset, 0, 0),

  yyyymmdd: (date, separate) => {
    if (date instanceof Date === false) return '';
    var s = separate || '';
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
    return [date.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd].join(s);
  },

  String2Date: (str, separate) => {
    var bits = str.split(separate);
    var d = new Date(bits[0], bits[1] - 1, bits[2]);
    var isValid = d && (d.getFullYear() === +bits[0]) && ((d.getMonth() + 1) === +bits[1]);
    return isValid? d : null;
  }
}