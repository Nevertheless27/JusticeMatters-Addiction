// Shared utilities and components for Justice Matters
(function() {
    'use strict';

    var NAV_ITEMS = [
        { href: 'index.html', text: 'Home' },
        { href: 'chat.html', text: 'Support Chat' },
        { href: 'stories.html', text: 'Family Stories' },
        { href: 'resources.html', text: 'Resources' }
    ];

    var FOOTER_HTML =
        '<div class="container">' +
            '<p>&copy; 2024 Justice Matters - Addiction Support. All rights reserved.</p>' +
            '<p>If you or someone you know is struggling with substance abuse, please call the SAMHSA National Helpline: 1-800-662-4357</p>' +
        '</div>';

    // Highlight an element with error styling, then reset after 2 seconds
    function highlightError(element, property) {
        var prop = property || 'borderColor';
        element.style[prop] = '#E74C3C';
        setTimeout(function() {
            element.style[prop] = '';
        }, 2000);
    }

    function buildNav() {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        var listItems = NAV_ITEMS.map(function(item) {
            var activeAttr = item.href === currentPage ? ' class="active"' : '';
            return '<li><a href="' + item.href + '"' + activeAttr + '>' + item.text + '</a></li>';
        }).join('');
        return '<nav>' +
            '<div class="nav-container">' +
                '<h1 class="logo">Justice Matters</h1>' +
                '<ul class="nav-menu">' + listItems + '</ul>' +
            '</div>' +
        '</nav>';
    }

    function injectComponents() {
        var header = document.querySelector('header');
        if (header) {
            header.innerHTML = buildNav();
        }

        var footer = document.querySelector('footer');
        if (footer) {
            footer.innerHTML = FOOTER_HTML;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectComponents);
    } else {
        injectComponents();
    }

    // Expose shared utilities
    window.JusticeMatters = window.JusticeMatters || {};
    window.JusticeMatters.highlightError = highlightError;
})();
