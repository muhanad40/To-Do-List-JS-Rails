describe 'Tasks CRUD:' do

	before(:each) do
		user = User.create(full_name: 'Muhanad Al-Rubaiee',
			email: 'muhanad@gmail.com',
			password: '12345678',
			password_confirmation: '12345678'
		)
		login_as user
	end

	it 'Adds a list item', js: true do
		visit '/'
		fill_in 'task-input', :with => 'Buy milk!'
		click_button '+'
		wait_for_ajax
		visit '/'
		expect(page).to have_content 'Buy milk!'
	end

end