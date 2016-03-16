import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './list.less!';
import template from './list.stache!';
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
  setAdmin: function ( user, isAdmin ) {
    return user.attr( "isAdmin", isAdmin ).save();
  }
});

export default Component.extend({
  tag: 'users-admin',
  viewModel: ViewModel,
  template
});