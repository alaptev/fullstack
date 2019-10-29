# frozen_string_literal: true

class RealTimeChannel < ApplicationCable::Channel

  # Called when the consumer has successfully
  # become a subscriber to this channel.
  def subscribed
    stream_from 'my_pubsub_queue'
    ActionCable.server.broadcast('my_pubsub_queue', 'HELLO NEW SUBSCRIBER')
  end
end