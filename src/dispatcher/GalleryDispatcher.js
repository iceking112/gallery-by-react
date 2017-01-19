var Dispatcher = require('flux').Dispatcher;
var GalleryDispatcher = new Dispatcher();
var GalleryStore = require('../stores/GalleryStore');

GalleryDispatcher.register(function (action) {
  switch(action.actionType) {
    case 'ChoicePhoto':
      GalleryStore.addNewItemHandler(action.text);
      console.log("in up emitChange");
      GalleryStore.emitChange();
      break;
    default:
      // no op
  }
})

module.exports = GalleryDispatcher;
