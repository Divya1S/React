import { useEffect, useState } from 'react'

function Github() {
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch('https://api.github.com/users/Divya1S')
            .then((response) => response.json())
            .then((data) => setData(data))
    }, [])

    if (!data) {
        return (
            <div className="text-center m-4 bg-gray-600 text-white p-4 text-2xl rounded-lg">
                Loading Github profile...
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto my-6 bg-gray-600 text-white rounded-lg overflow-hidden shadow-lg">
            <div className="flex flex-col items-center p-6">
                <img
                    src={data.avatar_url}
                    alt={`${data.login} avatar`}
                    className="w-40 h-40 rounded-full border-4 border-white object-cover"
                />
                <h1 className="mt-4 text-3xl font-bold">{data.name}</h1>
                <a
                    href={data.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-300 hover:underline"
                >
                    @{data.login}
                </a>
                {data.bio && <p className="mt-3 text-center text-gray-200">{data.bio}</p>}
                {data.location && (
                    <p className="mt-2 text-sm text-gray-300">📍 {data.location}</p>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-500 text-center">
                <div className="bg-gray-600 p-4">
                    <p className="text-2xl font-bold">{data.public_repos}</p>
                    <p className="text-sm text-gray-300">Repositories</p>
                </div>
                <div className="bg-gray-600 p-4">
                    <p className="text-2xl font-bold">{data.followers}</p>
                    <p className="text-sm text-gray-300">Followers</p>
                </div>
                <div className="bg-gray-600 p-4">
                    <p className="text-2xl font-bold">{data.following}</p>
                    <p className="text-sm text-gray-300">Following</p>
                </div>
                <div className="bg-gray-600 p-4">
                    <p className="text-2xl font-bold">{data.public_gists}</p>
                    <p className="text-sm text-gray-300">Gists</p>
                </div>
            </div>
        </div>
    )
}

export default Github
