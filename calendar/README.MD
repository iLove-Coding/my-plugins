### 原生 js 日历插件

SchedulePlugin

使用示例：

```javascript
const mySchedule = new SchedulePlugin({
  el: ".js-option-calendar",
  clickCb: (y, m, d) => {},
  prevMonthCb: (y, m, d) => {},
  nextMonthCb: (y, m, d) => {}
  upDate: '2020, 11',
  noPrevDate: true
});
```

| 参数 | 说明 |
| :---- | :---- |
| el|日历容器|
|clickCb|点击日期回调函数|
|prevMonthCb|点击上一月回调函数|
|nextMonthCb|点击下一月回调函数|
|upDate|日期展示上限，'年,月'|
|noPrevDate|是否可选今天之前的时间|

[在线展示](https://htmlpreview.github.io/?https://github.com/iLove-Coding/my-plugins/blob/master/calendar/demo.html)
