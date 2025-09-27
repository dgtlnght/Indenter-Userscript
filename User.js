// ==UserScript==
// @name         Tab to Indent
// @namespace    https://google.com
// @version      0.6
// @description  Makes Tab insert a tab character
// @author       dgtlnght
// @match        https://lunette.app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function insertTab(event) {
        if (event.key === 'Tab') {
            event.preventDefault();

            const activeElement = document.activeElement;
            if (activeElement.tagName === 'TEXTAREA' || 
                (activeElement.tagName === 'INPUT' && activeElement.type === 'text') || 
                activeElement.isContentEditable) {

                if (activeElement.isContentEditable) {
                    const range = window.getSelection().getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode('\t'));
                    range.setStartAfter(range.endContainer);
                    range.setEndAfter(range.endContainer);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                } else {
                    const start = activeElement.selectionStart;
                    const end = activeElement.selectionEnd;

                    activeElement.value = activeElement.value.substring(0, start) + '\t' + activeElement.value.substring(end);
                    activeElement.selectionStart = activeElement.selectionEnd = start + 1;
                }
            }
        }
    }

    function attachTabListener() {
        const elements = document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
        elements.forEach(element => {
            if (!element.hasAttribute('data-tab-listener')) {
                element.setAttribute('data-tab-listener', 'true');
                element.addEventListener('keydown', insertTab, true);
            }
        });
    }

    const observer = new MutationObserver(() => {
        attachTabListener();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    attachTabListener();

})();
