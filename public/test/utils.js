import $ from 'jquery';
import F from 'funcunit';

export default {
    insertAndPopulateIframe: function (iframeParentSelector, frag) {
        var localStyles = $('head style').clone();
        var iframe = $(document.createElement('iframe'));
        var iframeWindow;

        // Insert the iframe
        $(iframeParentSelector).append(iframe);

        // Get the context of the iframe (now that it's been added to the DOM)
        iframeWindow = iframe[0].contentWindow;

        // Populate the iframe
        iframe.contents().find('body').append(frag);
        iframe.contents().find('head').append(localStyles);

        // Convince FuncUnit that the iframe is loaded
        // (https://github.com/bitovi/funcunit/issues/139)
        F.documentLoaded = function () { return true; };

        // Set the context of FuncUnit to be the iframe
        F.open(iframeWindow);
    }
};