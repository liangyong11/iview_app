/**
 * Created by liangyong on 2018/4/16.
 */

export class Common {
    guid() {
        var guid = '';
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0);
            if (i === 1) {
                if (n < 10) {
                    i = 0;
                    continue;
                }
            }
            var code = n.toString(16);
            guid += code;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) {
                guid += '-';
            }
        }
        return guid;
    }

    getBrowser() {
        var browser = null, info = '';
        var userAgent = navigator.userAgent.toLowerCase();
        if (info = userAgent.match(/msie ([\d.]+)/)) {
            browser = {name: 'IE', version: info[1]};
        }
        else if (info = userAgent.match(/firefox\/([\d.]+)/)) {
            browser = {name: 'Firefox', version: info[1]};
        }
        else if (info = userAgent.match(/chrome\/([\d.]+)/)) {
            browser = {name: 'Chrome', version: info[1]};
        }
        else if (info = userAgent.match(/opera.([\d.]+)/)) {
            browser = {name: 'Opera', version: info[1]};
        }
        else if (info = userAgent.match(/version\/([\d.]+).*safari/)) {
            browser = {name: 'Safari', version: info[1]};
        }
        else {
            browser = {name: 'Unknown', version: '0.0'};
        }
        browser.version = browser.version.substr(0, browser.version.indexOf('.'));
        return browser;
    }

    getOffset(domElement) {
        var x = domElement.offsetLeft;
        var y = domElement.offsetTop;
        while (domElement = domElement.offsetParent) {
            x += domElement.offsetLeft;
            y += domElement.offsetTop;
        }
        return {left: x, top: y};
    }

    getEvent(event) {
        return event || window.event;
    }

    getTarget(event) {
        event = this.getEvent(event);
        return event.target || event.srcElement;
    }

    dragArrayDrop(dragsourceArray, droptarget, dragdrop) {
        var currentBrowser = this.getBrowser();
        for (var index = 0; index < dragsourceArray.length; index++) {
            var dragsource = dragsourceArray[index];
            dragsource.addEventListener('dragstart', function (event) {
                event.dataTransfer.effectAllowed = 'move';
                if (currentBrowser.name === 'IE') {
                    event.dataTransfer.setData('text', this.className);
                }
                else {
                    event.dataTransfer.setData('mydata', this.className);
                    event.dataTransfer.setDragImage(event.target, 0, 0);
                }
            }, false);
            dragsource.addEventListener('dragend', function (event) {
                if (currentBrowser.name === 'IE') {
                    event.dataTransfer.clearData('text');
                }
                else {
                    event.dataTransfer.clearData('mydata');
                }
            }, false);
        }
        droptarget.addEventListener('drop', function (event) {
            var data = '';
            if (currentBrowser.name === 'IE') {
                data = event.dataTransfer.getData('text');
            }
            else {
                data = event.dataTransfer.getData('mydata');
            }
            dragdrop(event, data);
        }, false);
        droptarget.addEventListener('dragover', function (event) {
            event.stopPropagation();
            event.preventDefault();
        }, false);
        droptarget.addEventListener('dragenter', function (event) {
            event.stopPropagation();
            event.preventDefault();
        }, false);
    }
}

export const lineState = {
    default: 0,
    couple: 1,
    child: 2,
    together: 3,
    intently: 4,
    nervous: 5,
    clash: 6,
    suspend: 7
};
