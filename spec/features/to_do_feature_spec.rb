require 'spec_helper'

describe 'To Do App' do

	context 'When not logged in' do

		it 'redirects the user to the log in page' do
			visit '/'
			expect(current_path).to have_content '/users/sign_in'
		end

	end

end