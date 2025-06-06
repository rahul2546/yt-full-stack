import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute () {
	
	const { isAuthenticated, loading } = useSelector((state) => state.auth);

	if (loading) return <div>Loading...</div> // loading state

	return isAuthenticated ? <Outlet /> : <Navigate to='/login' />

};

// we will use this component to secure our pages 
// we will add this component when we are performing routing