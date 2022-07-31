const bcrypt = require('bcryptjs');

// Function to hash users password
const hash = async (password) => {
	// Generate salt

	const salt = await bcrypt.genSalt(10);
	// Hash the password
	password = await bcrypt.hash(password, salt);
	return password;
};

// Function to compare hashed password's
const compare = async (hash, pass) => {
	return bcrypt.compare(hash, pass);
};

module.exports = {
	hash,
	compare,
};
