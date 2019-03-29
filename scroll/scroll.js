(function () {
    class AutoScroll {
        constructor(obj) {
            this.obj = obj;
            this.linkUrl = 'module/scroll/scroll.css';
            //滚动内容
            this.scrollContent = null;
            //滚动条元素
            this.scrollBox = null;
            //滚动元素
            this.scrollTool = null;
            //记录滚动条的高度
            this.num = 0;
            //滚动速度
            this.speed = 10;
            //初始化
            this.init();
        }

        init() {
            //如果存在同id的css标签则删除
            let scrollStyle = document.querySelector('#scrollStyle');
            if (scrollStyle) {
                document.querySelector('head').removeChild(scrollStyle);
            }

            //在head标签中引入css样式
            let link = document.createElement('link');
            link.href = this.linkUrl;
            link.rel = "stylesheet";
            link.setAttribute('id', '#scrollStyle');
            let head = document.querySelector('head');
            head.appendChild(link);

            //创建滚动结构条件
            let h1 = this.obj.clientHeight;
            let h2 = this.obj.scrollHeight;

            //如果内容不足以溢出可视区域 就不需要滚动条
            if (h1 >= h2) return;

            //否则创建滚动条
            this.createScroll(h1, h2);
            this.scrollContent = this.obj.querySelector('.scroll-content');
            this.scrollBox = this.obj.querySelector('.scroll-box');
            this.scrollTool = this.obj.querySelector('.scroll-tool');

            this.scrollTool.onmousedown = (event) => {
                event.preventDefault();
                let x1 = event.clientX;
                let y1 = event.clientY;

                this.drag.call(this, x1, y1);
            };
            this.wheel();
        }

        createScroll(h1, h2) {
            //内容溢出，创建滚动结构
            let scrollContent = document.createElement('div');
            scrollContent.classList.add('scroll-content');
            document.body.appendChild(scrollContent);

            //注意：会丢失元素节点的事件和私有属性
            scrollContent.innerHTML = this.obj.innerHTML;
            this.obj.innerHTML = "";
            this.obj.appendChild(scrollContent);
            this.obj.position = "relative";

            //创造滚动条scrollBox，滚动元素tool
            let scrollBox = document.createElement('div');
            scrollBox.classList.add('scroll-box');
            scrollBox.style.height = h1 + "px";
            scrollBox.style.top = this.offsetVal(this.obj).offsetT + "px";
            scrollBox.innerHTML = `<div class='scroll-tool' style='height: ${h1 / h2 * h1}px' </div>`;
            this.obj.appendChild(scrollBox);
            scrollBox.style.left = this.offsetVal(this.obj).offsetL + (this.obj.offsetWidth - 7) + "px";
        }

        drag(x1, y1) {
            document.onmousemove = (event) => {
                let x2 = event.clientX;
                let y2 = event.clientY;
                let x = Math.abs(x2 - x1);
                let y = y2 - y1;
                let topValue = this.num + y;
                //边界处理
                if (topValue <= 0) {
                    topValue = 0;
                }
                if (topValue >= this.obj.offsetHeight - this.scrollTool.offsetHeight) {
                    topValue = this.obj.offsetHeight - this.scrollTool.offsetHeight;
                }
                this.scrollTool.style.top = topValue + "px";
                this.scrollContent.style.marginTop = -((topValue / this.obj.offsetHeight) * this.scrollContent.offsetHeight) + "px";
                //横向边界处理
                if (x > 100) {
                    this.num = this.offsetVal(this.scrollTool).offsetT;//记录变化后的位置
                    document.onmousemove = null;
                }
            }
            document.onmouseup = (event) => {
                document.onmousemove = null;
                this.num = this.offsetVal(this.scrollTool).offsetT;//记录变化后的位置
            }
        }

        wheel() {
            //chrome--event.wheelDelta, >0为鼠标滚轮向上滚动，<0为向下滚动
            this.obj.onmousewheel = (event) => {
                let oEvent = event || window.event;
                oEvent.preventDefault();
                oEvent.wheelDelta > 0 ? this.up() : this.down();
            }

            //firefox--event.detail,>0为鼠标向下滚动，<0为向上滚动
            document.addEventListener('DOMMouseScroll', (event) => {
                let oEvent = event || window.event;
                oEvent.preventDefault();
                oEvent.detail > 0 ? this.down() : this.up();
            })
        }

        up() {
            this.num -= this.speed;
            if (this.num <= 0) {
                this.num = 0;
            }
            this.scrollTool.style.top = this.num + "px";
            this.scrollContent.style.marginTop = -((this.num / this.scrollBox.clientHeight) * this.scrollContent.offsetHeight) + "px";
        }

        down() {
            this.num += this.speed;
            if (this.num >= this.scrollBox.clientHeight - this.scrollTool.offsetHeight) {
                this.num = this.scrollBox.clientHeight - this.scrollTool.offsetHeight;
            }
            this.scrollTool.style.top = this.num + "px";
            this.scrollContent.style.marginTop = -((this.num / this.scrollBox.clientHeight) * this.scrollContent.offsetHeight) + "px";
        }

        offsetVal(obj) {
            let offsetLeftVal = obj.offsetLeft;
            let offsetTopVal = obj.offsetTop;

            if (obj.offsetParent) {
                offsetLeftVal = offsetLeftVal + this.offsetVal(obj.offsetParent).offsetL;
                offsetTopVal = offsetTopVal + this.offsetVal(obj.offsetParent).offsetT;
            }
            return {
                offsetL: offsetLeftVal,
                offsetT: offsetTopVal
            };
        }
    }

    window.AutoScroll = AutoScroll;
})();
