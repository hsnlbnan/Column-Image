/**
* demo.js
* http://www.codrops.com
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 
* Copyright 2019, Codrops
* http://www.codrops.com
*/
{
    const MathUtils = {
        lineEq: (y2, y1, x2, x1, currentVal) => {
            const m = (y2 - y1) / (x2 - x1);
            const b = y1 - m * x1;
            return m * currentVal + b;
        },
        lerp: (a, b, n) => (1 - n) * a + n * b,
        getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
    };
    const body = document.body;
    const docEl = document.documentElement;

    let winsize;
    const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
    calcWinsize();
    window.addEventListener('resize', calcWinsize);

    // Gets the mouse position. From http://www.quirksmode.org/js/events_properties.html#position
    const getMousePos = (ev) => {
        let posx = 0;
        let posy = 0;
        if (!ev) e = window.event;
        if (ev.pageX || ev.pageY)   {
            posx = ev.pageX;
            posy = ev.pageY;
        }
        else if (ev.clientX || ev.clientY)  {
            posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
            posy = ev.clientY + body.scrollTop + docEl.scrollTop;
        }
        return { x : posx, y : posy }
    };
    let mousepos = {x: winsize.width/2, y: winsize.height/2};
    window.addEventListener('mousemove', ev => mousepos = getMousePos(ev));
    
    let activeTilt = {
        columns: true,
        letters: true,
    }

    // Custom cursor
    class Cursor {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.circle = this.DOM.el.querySelector('.cursor__inner--circle');
            this.bounds = this.DOM.circle.getBoundingClientRect();
            this.lastMousePos = {x:0, y:0};
            this.scale = 1;
            this.lastScale = 1;
            this.lastY = 0;
            requestAnimationFrame(() => this.render());
        }
        render() {
            this.lastMousePos.x = MathUtils.lerp(this.lastMousePos.x, mousepos.x - this.bounds.width/2, 0.15);
            this.lastMousePos.y = MathUtils.lerp(this.lastMousePos.y, mousepos.y - this.bounds.height/2, 0.15);
            this.direction = this.lastY - mousepos.y > 0 ? 'up' : 'down';
            this.lastScale = MathUtils.lerp(this.lastScale, this.scale, 0.15);
            this.DOM.circle.style.transform = `translateX(${(this.lastMousePos.x)}px) translateY(${this.lastMousePos.y}px) scale(${this.lastScale})`;
            this.lastY = mousepos.y;
            requestAnimationFrame(() => this.render());
        }
        enter() {
            this.scale = 1.5;
        }
        leave() {
            this.scale = 1;
        }
        click() {
            this.lastScale = .4;
        }
    }

    // Vertical images column
    class Column {
        constructor(el) {
            this.DOM = {el: el};

            // The column's height
            const rect = this.DOM.el.getBoundingClientRect();
            this.height = rect.height;
            
            // Check if the column starts on the top of the viewport or if it ends on the bottom of the viewport. This will define the column's translation direction.
            this.isBottom = this.DOM.el.classList.contains('column--bottom');

            // Tilt the column on mousemove.
            this.tilt();
        }
        tilt() {
            let translationVals = {tx: 0, ty: 0};
            const randX = MathUtils.getRandomFloat(5,20);
            const rY1 = this.isBottom ? MathUtils.getRandomFloat(10,30) : MathUtils.getRandomFloat(30,80);
            const rY2 = this.isBottom ? MathUtils.getRandomFloat(30,80) : MathUtils.getRandomFloat(10,30);
            const render = () => {
                if ( activeTilt.columns ) {
                    translationVals.tx = MathUtils.lerp(translationVals.tx, MathUtils.lineEq(-randX, randX, winsize.width, 0, mousepos.x), 0.03);
                    translationVals.ty = MathUtils.lerp(translationVals.ty, MathUtils.lineEq(-rY1, rY2, winsize.height, 0, mousepos.y), 0.03);
                    TweenMax.set(this.DOM.el, {
                        x: translationVals.tx, 
                        y: translationVals.ty,
                        rotation: 0.01
                    });
                }
                else {
                    translationVals = {tx: 0, ty: 0};
                }
                requestAnimationFrame(render);
            }
            
            requestAnimationFrame(render);
        }
    }

   

    // A Menu Item
  
  
    // Custom mouse cursor
    const cursor = new Cursor(document.querySelector('.cursor'));
   
    
    class Menu {
        constructor(el) {
            this.DOM = {el: el};
            // The menu items
            this.DOM.items = document.querySelectorAll('.menu > .menu__item');
            this.menuItems = Array.from(this.DOM.items, item => new MenuItem(item));
            // Init/Bind events
            this.initEvents();
        }};
    
    
    // The image columns behind the menu
    const columnsWrap = document.querySelector('.columns');
    const columnsElems = columnsWrap.querySelectorAll('.column');
    const columnsTotal = columnsElems.length;
    let columns;

   

    // Activate the enter/leave/click methods of the custom cursor when hovering in/out on every <a> and when clicking anywhere
    [...document.querySelectorAll('a')].forEach((link) => {
        link.addEventListener('mouseenter', () => cursor.enter());
        link.addEventListener('mouseleave', () => cursor.leave());
    });
    document.addEventListener('click', () => cursor.click());

    // Preload all the images in the page
    imagesLoaded(document.querySelectorAll('.column__img'), {background: true}, () => {
        columns = Array.from(columnsElems, column => new Column(column));       
        document.body.classList.remove('loading');
    });
}