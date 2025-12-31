export default function SliderNav({ active, setActive }) {
  return (
    <div className="flex bg-gray-200 rounded-full p-1 w-72 mb-4 my-11">
      {["Subscriptions", "Assets"].map(tab => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`flex-1 py-2 rounded-full ${
            active === tab ? "bg-white shadow" : ""
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

