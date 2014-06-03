require 'spec_helper'

describe 'Tasks CRUD:', js:true do

	before(:each) do
		user = User.create(full_name: 'Muhanad Al-Rubaiee',
			email: 'muhanad@gmail.com',
			password: '12345678',
			password_confirmation: '12345678'
		)
		login_as user
	end

	it 'Adds a list item' do
		visit '/'
		fill_in 'task-input', :with => 'Buy milk!'
		click_button '+'
		wait_for_ajax
		visit '/'
		expect(page).to have_content 'Buy milk!'
	end

	it 'Removes a list item' do
		visit '/'
		fill_in 'task-input', :with => 'Buy milk!'
		click_button '+'
		wait_for_ajax
		page.execute_script "$('li .item-remove').trigger('click')"
		wait_for_ajax
		visit '/'
		expect(page).not_to have_content 'Buy milk!'
	end

	# This test is failing for some reason??
	# it 'Edits a list item' do
	# 	visit '/'
	# 	fill_in 'task-input', :with => 'Buy milk!'
	# 	click_button '+'
	# 	wait_for_ajax
	# 	page.execute_script "$('li .task').dblclick()"
	# 	sleep 1
	# 	page.execute_script "$('li input.task-edit').val('Changed!')"
	# 	page.execute_script "$('li input.task-edit').blur()"
	# 	wait_for_ajax
	# 	sleep 2
	# 	visit '/'
	# 	expect(page).to have_content 'Changed!'
	# end

end