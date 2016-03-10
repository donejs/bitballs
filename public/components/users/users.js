import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './users.less!';
import template from './users.stache!';
import User from "bitballs/models/user";

export const ViewModel = Map.extend({
  define: {
    users: {
      get: function ( list ) {
        if ( list ) return list;
        return User.getList({});
      }
    }
  },
  toggleAdmin: function ( user, el, ev ) {
    var userid = user.attr( "id" );
    var setto = el.checked;
    el.checked = !setto;
    return $.get( "/services/setadmin/"+userid+"/"+setto ).then(function () {
      el.checked = setto;
    });
  }
});

export default Component.extend({
  tag: 'users-admin',
  viewModel: ViewModel,
  template
});