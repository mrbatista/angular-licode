'use strict';

angular.module('pl-licode-mocks')
  .factory('Erizo', function() {
    var streams = [];

    function EventObject() {
      var self = this;

      self.events = {};

      self.addEventListener = function(name, handler) {
        if (self.events.hasOwnProperty(name))
          self.events[name].push(handler);
        else
          self.events[name] = [handler];
      };

      self.removeEventListener = function(name) {
        if (self.events.hasOwnProperty(name))
          delete self.events[name];
      };

      self.fireEvent = function(name, args) {
        if (!self.events.hasOwnProperty(name))
          return;

        if (!args || !args.length)
          args = [];

        var evs = self.events[name];
        var l = evs.length;
        for (var i = 0; i < l; i++) {
          evs[i].apply(null, args);
        }
      };
    };

    self.Room = function(options) {
      var room = new EventObject();

      room.localStreams = [];
      room.remoteStreams = [];

      room.subscribe = function(stream) {
        if (streams.indexOf(stream) >= 0) {
          room.remoteStreams.push(stream);

          var streamEvent = {
            stream: stream,
          };

          room.fireEvent('stream-subscribed', [streamEvent, stream]);
        }
      };

      room.publish = function(stream) {
        streams.push(stream);
        room.localStreams.push(stream);

        var streamEvent = {
          stream: stream,
        };

        room.fireEvent('stream-added', [streamEvent, stream]);
      };

      room.connect = function() {
        var roomEvent = {
          streams: streams,
        };

        room.fireEvent('room-connected', [roomEvent]);
      };

      room.disconnect = function() {
        room.fireEvent('room-disconnected');
      };

      return room;
    };

    self.Stream = function() {
      var stream = new EventObject();
      stream.init = function() {

      };

      stream.sendData = function(data) {
        var dataEvent = {
          stream: stream,
          msg: data,
        };

        stream.fireEvent('stream-data', [dataEvent]);
      };

      return stream;
    };
  });
