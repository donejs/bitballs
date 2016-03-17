import $ from 'jquery';
import can from 'can';
import 'can/view/stache/stache';
import QUnit from 'steal-qunit';
import F from 'funcunit';
import testUtils from 'bitballs/test/utils';
import './navigation';

F.attach(QUnit);

QUnit.module('components/navigation/', {
    beforeEach: function () {
        var frag = can.stache('<bitballs-navigation></bitballs-navigation>')();
        testUtils.insertAndPopulateIframe('#qunit-fixture', frag);
    },
    afterEach: function () {
        $('#qunit-fixture').empty();
    }
});

QUnit.test('Layout preserved at smaller screen resolutions', function (assert) {
    var evaluateAtWidth = function (resolution) {
        // Set the width
        F('#qunit-fixture iframe').then(function () {

            // For some reason the query needs to be redone
            $(this.selector).css('width', resolution);
        });

        // Confirm the styles
        F('.session-menu')
            .visible('Session menu is visible at ' + resolution)
            .css('float', 'right',
                'Session menu is floated right at ' + resolution);
        F('.main-menu')
            .visible('Main menu is visible at ' + resolution)
            .css('float', 'left',
                'Main menu is floated left at ' + resolution);
    };

    evaluateAtWidth('1170px');
    evaluateAtWidth('750px');
});

QUnit.test('Register button exists', function () {
    var frag = can.stache('<bitballs-navigation></bitballs-navigation>')();
    var buttons = $(frag).find('.register-btn');

    QUnit.equal(buttons.length, 1, 'Register button found');
});
