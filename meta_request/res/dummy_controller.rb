# frozen_string_literal: true

class DummyController < ApplicationController
  def index
    respond_to do |format|
      format.html { render text: 'Hello' }
    end
  end
end
