class TaskController < ApplicationController

	def index
		authenticate_user!
	end

	def all_tasks
		authenticate_user!
		all = current_user.tasks(:order =>'order asc')
		render json: all
	end

	def create
		authenticate_user!
		@task = current_user.tasks.create(task: params[:task], status: params[:status], user_id: current_user.id, order: params[:order])
		render 'task', content_type: :json
	end

	def destroy
		authenticate_user!
		current_user.tasks.find(params[:id]).destroy!
		render json: {}
	end

	def update
		authenticate_user!
		task = current_user.tasks.find(params[:id])
		task.update(params.permit(:task, :status, :order))
		render json: {}
	end

end