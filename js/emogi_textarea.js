/**
 * Created by mkhong on 2017-01-25.
 */
if (typeof Emoji == 'undefined') {
    var Emoji = function () { };
    Emoji.prototype = {
        constructor : function () {
            this.selectPastedContent = false;
        },
        setElement : function (ele) {
            this.ele = ele;
        },
        setSelectPastedContent : function(v)
        {
            this.selectPastedContent = v;
        },
        setInputElement : function (ele) {
            this.inputEle = ele;
        },
        pasteHtmlAtCaret : function()
        {
            var sel, range;
            if (window.getSelection) {
                // IE9 and non-IE
                sel = window.getSelection();

                if (sel.getRangeAt && sel.rangeCount) {
                    if (this.ele != sel.baseNode) {
                        this.ele.innerHTML += this.input;
                    } else {
                        range = sel.getRangeAt(0);
                        range.deleteContents();

                        // Range.createContextualFragment() would be useful here but is
                        // only relatively recently standardized and is not supported in
                        // some browsers (IE9, for one)
                        var el = document.createElement("div");
                        el.innerHTML = this.input;

                        var frag = document.createDocumentFragment(), node, lastNode;


                        while ( (node = el.firstChild) ) {
                            lastNode = frag.appendChild(node);
                        }
                        var firstNode = frag.firstChild;
                        range.insertNode(frag);

                        // Preserve the selection
                        if (lastNode) {
                            range = range.cloneRange();
                            range.setStartAfter(lastNode);
                            if (this.selectPastedContent) {
                                range.setStartBefore(firstNode);
                            } else {
                                range.collapse(true);
                            }
                            // sel.removeAllRanges();
                            // sel.addRange(range);
                        }
                    }

                } else {
                    this.ele.innerHTML += this.input;
                }
            } else if ( (sel = document.selection) && sel.type != "Control") {
                // IE < 9
                var originalRange = sel.createRange();
                originalRange.collapse(true);
                if (sel.createRange().parentElement() != this.ele) {
                    this.ele.innerHTML += this.input;
                } else {
                    sel.createRange().pasteHTML(this.input);

                }
                if (this.selectPastedContent) {
                    range = sel.createRange();
                    range.setEndPoint("StartToStart", originalRange);
                    range.select();
                }

            }

            this.contentClone();
        },
        insert : function (obj)
        {

            this.input = '<div><img class="emogi_icon" src="'+$(obj).find('img').attr('src')+'" width="80"></div>';
            this.pasteHtmlAtCaret();

        },
        contentClone : function () {
            if ($) {
                $(this.inputEle).val(this.ele.innerHTML);
            } else {
                if (this.inputEle && ['TEXTAREA', 'INPUT'].indexOf(this.inputEle.tagName) >= 0) {
                    this.inputEle.value = this.ele.innerHTML;
                }
            }


        }
    };
}

if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (var i = (start || 0); i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
    }
}
