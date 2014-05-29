require 'spec_helper'

describe User do
  
  it 'Adds user full name' do
  	user = User.create(
  		full_name: 'Muhanad Al-Rubaiee',
  		email: 'muhanad@gmail.com',
  		password: '12345678',
  		password_confirmation: '12345678'
  	)
  	expect(user.full_name).to eq 'Muhanad Al-Rubaiee'
  end

end
