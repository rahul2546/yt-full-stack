import React, { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { loading, error } = useSelector((state) => state.auth);

	const handleLogin = async (e) => {
		e.preventDefault();

		// Dispatch the thunk and unwrap the result to see if it was successful
		const resultAction = await dispatch(login({ email, password }));

		// login.fulfilled.type is the action type for a successful login
		if (login.fulfilled.match(resultAction)) {
			// Redirect to homepage or dashboard after successful login
			navigate('/');
		}
		// If login failed, the error message is already handled in the slice
	}
return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email and password to log in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="naina1@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* Display error message if the login fails */}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
		   <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="underline">Sign Up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;