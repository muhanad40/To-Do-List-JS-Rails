class TaskController < ApplicationController

	def index
		authenticate_user!
	end

	def create
		authenticate_user!
		@task = current_user.tasks.create(task: params[:task], status: params[:status], user_id: current_user.id, order: params[:order])
		render :json => @task
	end

end