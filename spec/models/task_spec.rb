require 'spec_helper'

describe Task do

	let(:user) do
		User.create({
			email: 'a@a.com',
			password: '12345678',
			password_confirmation: '12345678'
		})
	end

	it "Adds a task to a user's account" do
		task = Task.create({
			task: 'Get milk',
			status: 'incomplete',
			order: 1,
			user_id: user.id
		})
		expect(user.tasks.first.task).to eq 'Get milk'
	end

end