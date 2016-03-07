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
  toggleAdmin: function ( user, el ) {
    console.log( "yep", user, el );
  }
});

export default Component.extend({
  tag: 'users-admin',
  viewModel: ViewModel,
  template
});