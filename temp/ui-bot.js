/*
 * UI Bot
 * https://github.com/ivopetkov/ui-bot
 * Copyright 2017, Ivo Petkov
 * Free to use under the MIT license.
 */

var UIBot = function (config) {

    if (typeof config === 'undefined') {
        config = {};
    }

    var speed = typeof config.speed === 'undefined' ? 1 : parseFloat(config.speed, 10);
    var startDelay = typeof config.startDelay === 'undefined' ? 1 * speed : parseInt(config.startDelay, 10);
    var slowdown = 1 / speed;

    if (typeof window.UIBotDataStorage === 'undefined') {
        window.UIBotDataStorage = {
            'styleKeys': []
        };
    }

    var styleKeys = window.UIBotDataStorage.styleKeys;
    var styleKey = 'slowdown=' + slowdown + ';';
    var styleID = null;
    for (var i in styleKeys) {
        if (styleKeys[i] === styleKey) {
            styleID = i;
        }
    }
    if (styleID === null) {
        styleID = styleKeys.length;
        styleKeys.push(styleKey);

        var style = '.ui-bot-pointer-' + styleID + '{top:0;left:0;width:22px;height:22px;position:fixed;z-index:999999999;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjUxMiIKICAgaGVpZ2h0PSI1MTIiCiAgIHZpZXdCb3g9IjAgMCA1MTIgNTEyIgogICBmaWxsPSIjMDAwMDAwIgogICBpZD0ic3ZnMjk5NSIKICAgdmVyc2lvbj0iMS4xIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjQ4LjQgcjk5MzkiCiAgIHNvZGlwb2RpOmRvY25hbWU9InR1dG9yaWFsLWN1cnNvci5zdmciPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTMwMDMiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMzMDAxIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTMwMyIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI3NDUiCiAgICAgaWQ9Im5hbWVkdmlldzI5OTkiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjAuNjUxODY0MDYiCiAgICAgaW5rc2NhcGU6Y3g9IjIyMi4zMjIyNCIKICAgICBpbmtzY2FwZTpjeT0iMjc1LjY5ODMxIgogICAgIGlua3NjYXBlOndpbmRvdy14PSI1NSIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcyOTk1IiAvPgogIDxwYXRoCiAgICAgZD0iTSAxODYuMTk4LDUxMi41NjZMIDk5Ljk4MywzMzYuMjg4TDAuMDAsNDMyLjQ4NkwwLjAwLDAuMDAgbCAzMzguODc3LDI1OS4zMThMIDIwMy43OSwyODMuMTUxbCA4Ni4yODUsMTc2LjQyMUwgMTg2LjE5OCw1MTIuNTY2eiBNIDEwOS40MzgsMjgyLjc4NWwgOTEuMjA3LDE4Ni40ODZsIDQ2Ljg1OC0yMy45MDVsLTkxLjEzNy0xODYuMzQybCAxMDUuMjExLTE4LjU2M0wgMzIuMDAsNjQuNzgxbDAuMDAsMjkyLjUxIEwgMTA5LjQzOCwyODIuNzg1eiIKICAgICBpZD0icGF0aDI5OTciIC8+CiAgPHBhdGgKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgIGQ9Ik0gMTA5LjQzOCwyODIuMjE5IDIwMC42NDUsNDY4LjcwNSAyNDcuNTAzLDQ0NC44IDE1Ni4zNjYsMjU4LjQ1OCAyNjEuNTc3LDIzOS44OTUgMzIsNjQuMjE0OTk3IDMyLDM1Ni43MjUgeiIKICAgICBpZD0icGF0aDI5OTctNCIKICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjIgogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmYiIC8+Cjwvc3ZnPgo=);background-size:100% 100%;background-position:center center;-webkit-transition:-webkit-transform ' + (1000 * slowdown) + 'ms ease-in-out;transition:-webkit-transform ' + (1000 * slowdown) + 'ms ease-in-out,-moz-transform ' + (1000 * slowdown) + 'ms ease-in-out,-ms-transform ' + (1000 * slowdown) + 'ms ease-in-out,-o-transform ' + (1000 * slowdown) + 'ms ease-in-out,transform ' + (1000 * slowdown) + 'ms ease-in-out;-webkit-transform:translateX(100px) translateY(100px);-moz-transform:translateX(100px) translateY(100px);-ms-transform:translateX(100px) translateY(100px);-o-transform:translateX(100px) translateY(100px);transform:translateX(100px) translateY(100px);}';
        style += '.ui-bot-pointer-' + styleID + ':before{content:"";z-index:999999998;position:fixed;top:-11px;left:-11px;border-radius:50%;background-color:#fff;opacity:0;width:22px;height:22px;box-shadow:0 0 0;-webkit-transition:-webkit-transform ' + (1000 * slowdown) + 'ms;transition:-webkit-transform ' + (1000 * slowdown) + 'ms,-moz-transform ' + (1000 * slowdown) + 'ms,-ms-transform ' + (1000 * slowdown) + 'ms,-o-transform ' + (1000 * slowdown) + 'ms,transform ' + (1000 * slowdown) + 'ms;}';
        style += '.ui-bot-pointer-' + styleID + '[data-click]:before{-webkit-animation:ui-bot-pointer-click-' + styleID + ' ' + (500 * slowdown) + 'ms;}';
        style += '@-webkit-keyframes ui-bot-pointer-click-' + styleID + '{from{-webkit-transform:scale(0.1);opacity:0.4;}to{-webkit-transform:scale(3);opacity:0;}}';

        var styleElement = document.createElement('style');
        styleElement.setAttribute('type', 'text/css');
        styleElement.setAttribute('id', 'ui-bot-internal-styles-' + styleID);

        var rules = document.createTextNode(style);
        if (styleElement.styleSheet) {// IE
            styleElement.styleSheet.cssText = rules.nodeValue;
        } else {
            styleElement.appendChild(rules);
        }
        var head = document.getElementsByTagName('head')[0];
        if (head) {
            head.appendChild(styleElement);
        }
    } else {
        styleElement = document.getElementById('ui-bot-internal-styles-' + styleID);
    }

    var pointer = document.createElement('div');
    pointer.setAttribute('class', 'ui-bot-pointer-' + styleID);
    document.body.appendChild(pointer);

    var getElementPosition = function (element) {
        var rectangle = element.getBoundingClientRect();
        return {
            'x': Math.round(rectangle.left),
            'y': Math.round(rectangle.top),
            'width': Math.round(rectangle.width),
            'height': Math.round(rectangle.height)
        };
    };

    var getCSSRules = function (pseudo) {
        var result = [];
        var styleSheets = document.styleSheets;
        var styleSheetsLength = styleSheets.length;
        for (var i = 0; i < styleSheetsLength; i++) {
            var styleSheet = document.styleSheets[i];
            var id = styleSheet.ownerNode.getAttribute('id');
            if (id !== null && id.indexOf('ui-bot-internal-styles-') === 0) {
                continue;
            }
            var rules = styleSheet.cssRules;
            if (rules !== null) {
                var rulesLength = rules.length;
                for (var j = 0; j < rulesLength; j++) {
                    var rule = rules[j];
                    if (typeof rule.selectorText !== 'undefined') {
                        var selector = rule.selectorText;
                        if (selector.indexOf(':' + pseudo) !== -1) {
                            selector.split(',').forEach(function (part) {
                                try {
                                    var selector = part.trim().replace(':' + pseudo, '');
                                    var elements = [];
                                    document.querySelectorAll(selector).forEach(function (element) {
                                        elements.push(element);
                                    });
                                    result.push({'selector': selector, 'cssText': rule.style.cssText, 'elements': elements});
                                } catch (e) {

                                }
                            });
                        }
                    }
                }
            }
        }
        return result;
    };

    var cssTextClassNames = [];
    var getClassNameForCssText = function (cssText) {
        var key = styleID + '-' + cssText;
        for (var i in cssTextClassNames) {
            if (cssTextClassNames[i][0] === key) {
                return cssTextClassNames[i][1];
            }
        }
        var styleSheet = typeof styleElement.styleSheet !== 'undefined' ? styleElement.styleSheet : styleElement.sheet;
        var cssRulesLength = styleSheet.cssRules.length;
        var className = 'uibot-generated-class-' + cssRulesLength;
        styleSheet.insertRule('.' + className + "{" + cssText + "}", cssRulesLength);
        cssTextClassNames.push([key, className]);
        return className;
    };

    var getElementsUnderPointer = function (parentsOnly) {
        if (typeof parentsOnly === 'undefined') {
            parentsOnly = false;
        }
        var position = getElementPosition(pointer);
        var result = [];
        var elements = document.elementsFromPoint(position.x, position.y);
        var elementsLength = elements.length;
        for (var i = 0; i < elementsLength; i++) {
            var element = elements[i];
            if (element !== pointer) {
                result.push(element);
                if (parentsOnly && element === document.body) {
                    break;
                }
            }
        }
        return result;
    };

    var setPointerPosition = function (x, y, next) {
        var position = getElementPosition(pointer);
        var getDistance = function (x1, y1, x2, y2) {
            return Math.round(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
        };
        var maxDistance = Math.max(window.innerWidth, window.innerHeight); // max distance should be travelled in 3 seconds
        var newTransitionDuration = getDistance(x, y, position.x, position.y) / maxDistance * 3000 * slowdown + 500 * slowdown;

        var transitionDuration = window.getComputedStyle(pointer).transitionDuration.split(',');
        for (var i in transitionDuration) {
            transitionDuration[i] = newTransitionDuration + 'ms';
        }
        var pointerStyle = pointer.style;
        pointerStyle.transitionDuration = transitionDuration.join(',');
        var transformValue = 'translateX(' + x + 'px) translateY(' + y + 'px)';
        pointerStyle.setProperty('-webkit-transform', transformValue);
        pointerStyle.setProperty('-moz-transform', transformValue);
        pointerStyle.setProperty('-ms-transform', transformValue);
        pointerStyle.setProperty('-o-transform', transformValue);
        pointerStyle.setProperty('transform', transformValue);
        window.setTimeout(next, newTransitionDuration + 500 * slowdown);

    };

    var showPointerClick = function (next) {
        pointer.setAttribute('data-click', '1');
        window.setTimeout(function () {
            pointer.removeAttribute('data-click');
            next();
        }, 1000 * slowdown);
    };

    var click = function () {
        var position = getElementPosition(pointer);
        pointer.style.display = 'none';
        var element = document.elementFromPoint(position.x, position.y);
        pointer.style.display = 'block';
        if (element !== null) {
            element.dispatchEvent(new MouseEvent('click', {
                view: window,
                target: element,
                bubbles: true,
                cancelable: true,
                clientX: position.x,
                clientY: position.y
            }));
        }
        var activeCSSRules = getCSSRules('active');
        var elementsUnderPointer = getElementsUnderPointer(true);
        elementsUnderPointer.forEach(function (element) {
            var addedClassNames = [];
            for (var i in activeCSSRules) {
                if (activeCSSRules[i].elements.indexOf(element) !== -1) {
                    var className = getClassNameForCssText(activeCSSRules[i].cssText);
                    element.classList.add(className);
                    addedClassNames.push(className);
                }
            }
            if (addedClassNames.length > 0) {
                window.setTimeout(function () {
                    addedClassNames.forEach(function (className) {
                        element.classList.remove(className);
                    });
                }, 150 * slowdown);
            }
        });
    };

    var done = false;

    var actions = [];
    var nextIndex = 0;

    var start = function () {
        window.setTimeout(function () {

            var hoveredElements = [];
            var positionCheck = function () {
                var hoverCSSRules = null;
                var elementsUnderPointer = getElementsUnderPointer(true);
                elementsUnderPointer.forEach(function (element) {
                    if (hoveredElements.indexOf(element) === -1) {
                        if (hoverCSSRules === null) {
                            hoverCSSRules = getCSSRules('hover');
                        }
                        hoveredElements.push(element);
                        for (var i in hoverCSSRules) {
                            if (hoverCSSRules[i].elements.indexOf(element) !== -1) {
                                var className = getClassNameForCssText(hoverCSSRules[i].cssText);
                                element.classList.add(className);
                            }
                        }
                        element.dispatchEvent(new Event('mouseover'));
                    }
                });
                hoveredElements.forEach(function (overElement) {
                    if (elementsUnderPointer.indexOf(overElement) === -1) {
                        hoveredElements.splice(hoveredElements.indexOf(overElement), 1);
                        overElement.classList.forEach(function (className) {
                            if (className.indexOf('uibot-generated-class-') === 0) {
                                overElement.classList.remove(className);
                            }
                        });
                        overElement.dispatchEvent(new Event('mouseout'));
                    }
                });
                if (!done) {
                    window.setTimeout(positionCheck, 16 * slowdown);
                }
            };
            positionCheck();

            execute(0);
        }, startDelay * 1000);
    };

    var execute = function (index) {
        if (index === nextIndex) {
            if (typeof actions[index] !== 'undefined') {
                nextIndex++;
                var action = actions[index];
                var getCurrentValue = function (value) {
                    if (typeof value === 'function') {
                        return value();
                    }
                    return value;
                }
                var next = function () {
                    window.setTimeout(function () {
                        execute(nextIndex);
                    }, 300 * slowdown);
                };
                if (action.type === 'moveTo') {
                    var x = getCurrentValue(action.x);
                    var y = getCurrentValue(action.y);
                    setPointerPosition(x, y, next);
                } else if (action.type === 'click') {
                    showPointerClick(next);
                    click();
                } else if (action.type === 'wait') {
                    var seconds = getCurrentValue(action.seconds);
                    window.setTimeout(next, seconds * 1000 * slowdown);
                } else if (action.type === 'moveToElement') {
                    var element = getCurrentValue(action.element);
                    var elementsUnderPointer = getElementsUnderPointer();
                    if (elementsUnderPointer.indexOf(element) !== -1) {
                        next();
                    } else {
                        var pointerPosition = getElementPosition(pointer);
                        var elementPosition = getElementPosition(element);
                        var x = elementPosition.x;
                        var y = elementPosition.y;
                        var offsetX = Math.min(Math.max(elementPosition.width / 5, 17), elementPosition.width / 2);
                        var offsetY = Math.min(Math.max(elementPosition.height / 5, 17), elementPosition.height / 2);

                        var isLeft = pointerPosition.x <= elementPosition.x;
                        var isRight = pointerPosition.x >= elementPosition.x + elementPosition.width;
                        var isTop = pointerPosition.y < elementPosition.y;

                        if (isLeft || isRight) {
                            x += isLeft ? offsetX : elementPosition.width - offsetX;
                            if (pointerPosition.y <= elementPosition.y) { // top
                                y += offsetY;
                            } else if (pointerPosition.y >= elementPosition.y + elementPosition.height) { // bottom
                                y += elementPosition.height - offsetY;
                            } else {
                                y = Math.min(Math.max(pointerPosition.y, elementPosition.y + offsetY), elementPosition.y + elementPosition.height - offsetY);
                            }
                        } else {
                            y += isTop ? offsetY : elementPosition.height - offsetY;
                            if (pointerPosition.x <= elementPosition.x) { // top
                                x += offsetX;
                            } else if (pointerPosition.x >= elementPosition.x + elementPosition.width) { // bottom
                                x += elementPosition.width - offsetX;
                            } else {
                                x = Math.min(Math.max(pointerPosition.x, elementPosition.x + offsetX), elementPosition.x + elementPosition.width - offsetX);
                            }
                        }
                        setPointerPosition(x, y, next);
                    }
//            } else if (action.type === 'clickElement') {
//                var element = getCurrentValue(action.element);
//                showPointerClick(next);
//                window.setTimeout(function () {
//                    element.click();
//                }, 50 * slowdown);
                } else if (action.type === 'focusElement') {
                    var element = getCurrentValue(action.element);
                    element.focus();
                    next();
                } else if (action.type === 'writeInElement') {
                    var element = getCurrentValue(action.element);
                    var text = getCurrentValue(action.text);
                    var writeFunction = typeof action.writeFunction !== 'undefined' ? action.writeFunction : null;
                    var setText = function (text) {
                        if (writeFunction === null) {
                            element.value = text;
                        } else {
                            writeFunction(text);
                        }
                    };
                    var counter = 0;
                    var interval = null;
                    var write = function () {
                        counter++;
                        if (counter >= text.length) {
                            setText(text);
                            window.clearInterval(interval);
                        } else {
                            setText(text.substring(0, counter));
                        }
                    };
                    setText('');
                    interval = window.setInterval(write, 300 / text.length * slowdown);
                    window.setTimeout(function () {
                        next();
                    }, 1000 * slowdown);
                } else if (action.type === 'call') {
                    action.callbackFunction(next);
                }
            } else {
                done = true;
            }
        }
    };

    this.moveTo = function (x, y) {
        actions.push({'type': 'moveTo', 'x': x, 'y': y});
        start();
        return this;
    };

    this.click = function () {
        actions.push({'type': 'click'});
        start();
        return this;
    };

    this.wait = function (seconds) {
        actions.push({'type': 'wait', 'seconds': seconds});
        start();
        return this;
    };

    this.moveToElement = function (element) {
        actions.push({'type': 'moveToElement', 'element': element});
        start();
        return this;
    };

//    this.clickElement = function (element) {
//        actions.push({'type': 'clickElement', 'element': element});
//        start();
//        return this;
//    };

    this.focusElement = function (element) {
        actions.push({'type': 'focusElement', 'element': element});
        start();
        return this;
    };

    this.writeInElement = function (element, text, writeFunction) {
        actions.push({'type': 'writeInElement', 'element': element, 'text': text, 'writeFunction': writeFunction});
        start();
        return this;
    };

    this.moveToElementAndClick = function (element) {
        this.moveToElement(element);
        //this.clickElement(element);
        this.click();
        start();
        return this;
    };

    this.moveToElementAndFocus = function (element) {
        this.moveToElement(element);
        //this.clickElement(element);
        this.click();
        this.focusElement(element); // todo remove because the click should focus
        start();
        return this;
    };

    this.moveToElementAndWrite = function (element, text) {
        this.moveToElement(element);
        //this.clickElement(element);
        this.click();
        this.writeInElement(element, text);
        start();
        return this;
    };

    this.call = function (callbackFunction) {
        actions.push({'type': 'call', 'callbackFunction': callbackFunction});
        start();
        return this;
    };

};
