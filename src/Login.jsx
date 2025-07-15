import { useState } from 'react';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		// Add your login logic here
		console.log('Login attempt with:', email, password);
		// After successful login, you can navigate to another route
	};

	return (
		<div className="login-container">
			<form onSubmit={handleSubmit}>
				<h2>Login</h2>
				<div>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit">Login</button>
			</form>
		</div>
	);
}

export default Login;