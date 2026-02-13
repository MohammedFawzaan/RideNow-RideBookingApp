import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { CaptainDataContext } from '../context/CaptainContext'
import RideNowIcon from '../assets/RideNowIcon.png'
import StartImage from '../assets/StartImage.jpeg'

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
        <div className="flex flex-col h-screen w-full">
            {/* Top 80% */}
            <div className="h-[80%] relative flex flex-col justify-between items-center">
                <img
                    className="h-full w-full object-cover"
                    src={StartImage}
                    alt="Start"
                />
                <img
                    className="w-40 absolute top-5 left-5 z-10"
                    src={RideNowIcon}
                    alt="RideNow"
                />
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