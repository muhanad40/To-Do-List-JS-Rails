class TaskController < ApplicationController

	def index
		authenticate_user!
	end

end