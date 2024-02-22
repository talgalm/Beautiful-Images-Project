class AuthController {
    // Handler for user login
    login(req, res) {
        // Extract username and password from request body
        const { email } = req.body;

        // Perform authentication logic (e.g., verify credentials)
        // For demonstration purposes, let's assume successful login
        if (email === 'user') {
            // If login successful, send success message
            console.log("hi!!!! hello user")
            res.status(200).json({ message: 'Login successful' });
        } else {
            // If login failed, send error message
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }

    // Handler for user registration
    register(req, res) {
        // Extract username and password from request body
        const { username, password } = req.body;

        // Perform registration logic (e.g., create new user)
        // For demonstration purposes, let's assume successful registration
        // You would typically save the user to a database
        res.status(201).json({ message: 'User registered successfully' });
    }
}

module.exports = new AuthController();
