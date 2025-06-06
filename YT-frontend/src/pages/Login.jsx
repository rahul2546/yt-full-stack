import React from "react";
import { card, button, input } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error } = useSelector((state) => state.auth);

	const onSubmit = async (data) => {

		try {
			const response = await dispatch(loginUser(data));

			if (loginUser.fulfilled.match(response)) {
				navigate("/"); // Redirect to home page on successful login
			}
		} catch (error) {
			console.error("Login failed:", error);

		}
	}
	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="w-full max-w-md">
				<div className={card}>
					<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-4">
							<label htmlFor="email" className="block text-sm font-medium mb-2">
								Email
							</label>
							<input
								type="email"
								id="email"
								className={input}
								{...register("email", { required: "Email is required" })}
							/>
							{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
						</div>
						<div className="mb-6">
							<label htmlFor="password" className="block text-sm font-medium mb-2">
								Password
							</label>
							<input
								type="password"
								id="password"
								className={input}
								{...register("password", { required: "Password is required" })}
							/>
							{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
						</div>
						<button type="submit" className={button} disabled={loading}>
							{loading ? "Logging in..." : "Login"}
						</button>
						{error && <p className="text-red-500 text-xs mt-4">{error}</p>}
					</form>
				</div>
			</div>
		</div>
	);
}

