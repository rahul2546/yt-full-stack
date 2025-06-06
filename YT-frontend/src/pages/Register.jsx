import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { card, input, button } from "@/components";

export default function Register() {
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
			const response = await dispatch(registerUser(data));

			if (registerUser.fulfilled.match(response)) {
				navigate("/"); // Redirect to home page on successful registration
			}
		} catch (error) {
			console.error("Registration failed:", error);
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="w-full max-w-md">
				<div className={card}>
					<h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-4">
							<label htmlFor="username" className="block text-sm font-medium mb-2">
								Username
							</label>
							<input
								type="text"
								id="username"
								className={input}
								{...register("username", { required: "Userame is required" })}
							/>
							{errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
						</div>
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
							Register
						</button>
					</form>
					{error && <p className="text-red-500 text-xs mt-4">{error}</p>}
				</div>
			</div>
		</div>
	);
};