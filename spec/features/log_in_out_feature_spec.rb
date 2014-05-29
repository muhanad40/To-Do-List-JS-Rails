require 'spec_helper'

describe 'To Do App' do

	context 'When not logged in' do

		it 'redirects the user to the log in page' do
			visit '/'
			expect(current_path).to have_content '/user/sign_in'
		end

	end

	context 'When logged in' do

		before(:each) do
			user = User.create(full_name: 'Muhanad Al-Rubaiee',
				email: 'muhanad@gmail.com',
				password: '12345678',
				password_confirmation: '12345678'
			)
			login_as user
		end

		it 'Displays the full name of the logged in user' do
			visit '/'
			expect(current_path).to have_content '/'
			expect(page).to have_content 'Muhanad Al-Rubaiee'
		end

	end

end