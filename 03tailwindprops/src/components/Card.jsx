function Card({ username, btnTxt="Book trip to random city"}) {
  console.log(username)
  return (
    // Full-screen gray backdrop that centers the card
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">

      {/* THE CARD */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">

        {/* Image area */}
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/37741181/pexels-photo-37741181.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Charming street view in Bergen, Norway"
            className="h-56 w-full object-cover"
          />
          {/* Floating tag on top of the image */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-semibold px-3 py-1 rounded-full">
            Europe
          </span>
        </div>

        {/* Text area */}
        <div className="p-6 text-left">

          {/* Title + rating on the same row */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{username}, Norway</h2>
            <span className="text-amber-500 text-sm font-medium">★ 4.9</span>
          </div>

          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Wander the cobbled streets and colorful wooden houses of Norway's
            most picturesque coastal city.
          </p>

          <div className="mt-4 text-slate-400 text-sm">📍 Vågen Harbour</div>

          <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold py-2.5 rounded-xl transition duration-200">
            {btnTxt} 
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
