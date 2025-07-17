import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import RideNowIcon from '../assets/RideNowIcon.png'
import { UserDataContext } from '../context/UserContext'
import { CaptainDataContext } from '../context/CaptainContext'

const Start = () => {
    const { user } = useContext(UserDataContext);
    const { captain } = useContext(CaptainDataContext);
    const navigate = useNavigate();

    const handleContinue = () => {
        if (user.token && user.role === 'user') {
            navigate('/home');
        }
        else if (captain.token && captain.role === 'captain') {
            navigate('/captain-home');
        } else {
            navigate('/users/login');
        }
    }

    return (
        <div className="flex flex-col h-screen w-screen">
            {/* Top 80% */}
            <div className="h-[80%] bg-cover bg-center bg-[url('https://images.pexels.com/photos/139303/pexels-photo-139303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] flex flex-col justify-between items-center relative">
                <img className="w-40 absolute left-5 top-5" src={RideNowIcon} alt="RideNow" />
            </div>

            {/* Bottom 20% */}
            <div className="h-[20%] bg-white pb-7 py-4 px-4 w-full">
                <h2 className="text-3xl font-bold">Get Started with RideNow</h2>
                <button
                    onClick={handleContinue}
                    className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5">
                    Continue
                </button>
            </div>
        </div>
    )
}

export default Start