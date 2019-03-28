(function () {
    class SchedulePlugin {
        constructor(opt = {}) {
            this.opt = this.extend({}, opt, true);
            this.curDate = opt.date ? new Date(opt.date) : new Date();
            // 是否不允许选择之前的时间
            this.noPrevDate = opt.noPrevDate ? opt.noPrevDate : false;
            // 设置展示时间上限
            this.upDate = opt.upDate ? new Date(opt.upDate) : '';
            // 当前展示年份
            this.year = this.curDate.getFullYear();
            // 当前展示月份
            this.month = this.curDate.getMonth();
            // 当前展示日期
            this.day = this.curDate.getDate();
            // 当前实际年份
            this.currentYear = this.curDate.getFullYear();
            // 当前实际月份
            this.currentMonth = this.curDate.getMonth();
            // 当前实际日期
            this.currentDay = this.curDate.getDate();
            // 当前点击的日期
            this.selectedDate = '';
            // 日历控件目标容器
            this.el = document.querySelector(opt.el) || document.querySelector('body');
            // 初始化
            this.init();
        }
        init() {
            const scheduleHd = `<div class="schedule-hd">
                                    <div class="show-year"><span>${this.year}</span>年</div>
                                    <div class="controls">
                                        <span class="arrow-icon left" id="prevMonth"></span>
                                        <span class="show-month" id="nextMonth">${this.month + 1}月</span>
                                        <span class="arrow-icon right" id="nextMonth"></span>
                                    </div>
                                </div>`;
            const scheduleWeek = `<ul class="week-ul ul-box">
                                    <li>日</li>
                                    <li>一</li>
                                    <li>二</li>
                                    <li>三</li>
                                    <li>四</li>
                                    <li>五</li>
                                    <li>六</li>
                                </ul>`;
            const scheduleBd = '<ul class="schedule-bd ul-box" ></ul>';
            this.el.innerHTML = scheduleHd + scheduleWeek + scheduleBd;
            this.bindEvent();
            this.render();
        }
        bindEvent() {
            this.el.addEventListener('click', (e) => {
                switch (e.target.id) {
                    case 'nextMonth':
                        this.nextMonthFun();
                        break;
                    case 'prevMonth':
                        this.prevMonthFun();
                        break;
                    default:
                        break;
                }
                if (e.target.className.indexOf('currentDate') > -1) {
                    this.opt.clickCb && this.opt.clickCb(this.year, this.month + 1, e.target.innerHTML); // eslint-disable-line
                    this.selectedDate = e.target.title;
                    this.day = e.target.innerHTML;
                    this.render();
                }
            }, false);
        }
        // 工具函数
        formatDate(y, m, d, symbol) {
            let res;
            symbol = symbol || '-';
            m = (m.toString())[1] ? m : '0' + m; // eslint-disable-line
            if (d) {
                d = (d.toString())[1] ? d : '0' + d; // eslint-disable-line
                res = y + symbol + m + symbol + d;
            } else {
                res = y + symbol + m;
            }
            return res;
        }
        // 配置合并
        extend(def, opt, override) {
            for (const k in opt) {
                if (opt.hasOwnProperty(k) && (!def.hasOwnProperty(k) || override)) { // eslint-disable-line
                    def[k] = opt[k];
                }
            }
            return def;
        }
        render() {
            // 当月总天数
            const fullDay = new Date(this.year, this.month + 1, 0).getDate();
            // 当月第一天是周几
            const startWeek = new Date(this.year, this.month, 1).getDay();
            // 元素总个数
            const total = (fullDay + startWeek) % 7 === 0 ? (fullDay + startWeek) : fullDay + startWeek + (7 - (fullDay + startWeek) % 7); // eslint-disable-line
            // 上月最后一天
            const lastMonthDay = new Date(this.year, this.month, 0).getDate();

            const eleTemp = [];
            if (this.day > fullDay) {
                this.day = fullDay;
            }
            const formatToday = this.formatDate(this.currentYear, this.currentMonth + 1, this.currentDay, '-');
            for (let i = 0; i < total; i++) {
                if (i < startWeek) {
                    eleTemp.push(`<li class="other-month"><span class="dayStyle">${lastMonthDay - startWeek + 1 + i}</span></li>`); // eslint-disable-line
                } else if (i < (startWeek + fullDay)) {
                    const nowDate = this.formatDate(this.year, this.month + 1, (i + 1 - startWeek), '-'); // eslint-disable-line
                    let addClass = '';
                    formatToday === nowDate && (addClass = 'today-flag'); // eslint-disable-line
                    (this.selectedDate === nowDate) && (addClass = 'selected-style'); // eslint-disable-line
                    // 如果设置了不展示之前的时间,特殊处理
                    if (this.noPrevDate) {
                        if (this.year === this.currentYear && this.month === this.currentMonth && i < startWeek + this.currentDay - 1) { // eslint-disable-line
                            eleTemp.push(`<li class="other-month"><span class="dayStyle">${i + 1 - startWeek}</span></li>`); // eslint-disable-line
                        } else {
                            eleTemp.push(`<li class="current-month"><span title=${nowDate} class="currentDate dayStyle ${addClass}">${i + 1 - startWeek}</span></li>`); // eslint-disable-line
                        }
                    } else {
                        eleTemp.push(`<li class="current-month"><span title=${nowDate} class="currentDate dayStyle ${addClass}">${i + 1 - startWeek}</span></li>`); // eslint-disable-line
                    }
                } else {
                    eleTemp.push(`<li class="other-month"><span class="dayStyle">${i + 1 - (startWeek + fullDay)}</span></li>`); // eslint-disable-line
                }
            }
            this.el.querySelector('.schedule-bd').innerHTML = eleTemp.join('');
            this.el.querySelector('.schedule-hd .show-year').innerHTML = `<span>${this.year}</span>年`;
            this.el.querySelector('.schedule-hd .show-month').innerHTML = `${this.month + 1}月`;
        }
        prevMonthFun() {
            if (this.noPrevDate) {
                if (this.year === this.currentYear) {
                    if (this.month > this.currentMonth) {
                        this.month -= 1;
                    }
                } else if (this.month - 1 < 0) {
                    this.year -= 1;
                    this.month = 11;
                } else {
                    this.month -= 1;
                }
            } else if (this.month - 1 < 0) {
                this.year -= 1;
                this.month = 11;
            } else {
                this.month -= 1;
            }
            this.render();
            this.opt.prevMonthCb && this.opt.prevMonthCb(this.year, this.month + 1, this.day); // eslint-disable-line
        }
        nextMonthFun() {
            if (this.upDate) {
                if (this.year === this.upDate.getFullYear()) {
                    if (this.month < 11) {
                        this.month += 1;
                    }
                } else if (this.month + 1 > 11) {
                    this.year += 1;
                    this.month = 0;
                } else {
                    this.month += 1;
                }
            } else if (this.month + 1 > 11) {
                this.year += 1;
                this.month = 0;
            } else {
                this.month += 1;
            }

            this.render();
            this.opt.nextMonthCb && this.opt.nextMonthCb(this.year, this.month + 1, this.day); // eslint-disable-line
        }
    }

    window.SchedulePlugin = SchedulePlugin;
})();