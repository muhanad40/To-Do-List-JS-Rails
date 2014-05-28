class TodoController < ApplicationController

	def index
		authenticate_user!
	end

end