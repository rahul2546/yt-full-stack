import api from './axios';

export const toggleSubscription = async(channelId) =>{
	try{
		const response = await api.post(`/subscription/${channelId}`);
		return response.data;
	}catch(error){
		console.error(`Error toggling subscription for channel ${channelId}:`, error);
		throw error;
	}
}