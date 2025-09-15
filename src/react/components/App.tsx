import React from "react";

const App = () => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg w-40 h-40 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Hello Tailwind!</h1>
      <p className="mt-2">This is your Chrome extension with Tailwind CSS</p>
      <button className="bg-white text-blue-500 px-4 py-2 rounded mt-4 hover:bg-gray-100">
        Click me
      </button>
    </div>
    // <div
    //   style={{
    //     width: "600px",
    //     height: "600px",
    //     backgroundColor: "gray",
    //     justifyItems: "center",
    //     alignItems: "center",
    //     display: "flex",
    //   }}
    // >
    //   <p style={{
    //     color: "white", fontSize: "14px", fontWeight: "bold"
    //   }}>Hello this is my extension</p>
    // </div>
  );
};

export default App;
