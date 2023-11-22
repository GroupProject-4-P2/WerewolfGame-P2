import werewolfIcon from '../../../public/assets/werewolf.jpg'
export const Vote = () => {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-lg shadow-md" style={{ width: '350px', height: '200px' }}>
                <div className="flex items-center mb-4">
                    <img src={werewolfIcon} alt="Werewolf Icon" className="mr-2 w-6 h-6" />
                    <h1 className="text-3xl font-bold text-white">Werewolf Voting</h1>
                </div>

                <div className="flex space-x-4">
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                        Vote Player 1
                    </button>
                </div>
            </div>
        </div>
    )
}