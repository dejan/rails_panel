class MetaRequestsController < ApplicationController
  def index
    # Execute query
    User.where(id: 1)
    head(:ok)
  end
end
