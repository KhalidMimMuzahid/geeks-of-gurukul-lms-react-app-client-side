import React from "react";

const OverView = () => {
  return (
    // parent
    <div className="mt-24">
      <h4 className="text-2xl font-poppins font-medium">Overview</h4>
      <div className='flex flex-col md:flex-row justify-between border border-1 border-[#D4D4D4] rounded-lg'>
        <div className="flex flex-col items-center justify-center p-12">
          <h4 className="text-2xl font-poppins">Above Average</h4>
          <p className="font-poppins font-medium">Rating</p>
      </div>
      <div className="h-16 border border-1 my-auto"></div>
        <div className="flex flex-col items-center justify-center p-12">
          <h4 className="text-2xl font-poppins">85%</h4>
          <p className="font-poppins font-medium">Percentile</p>
      </div>
      <div className="h-16 border border-1 my-auto"></div>
        <div className="flex flex-col items-center justify-center p-12">
          <h4 className="text-2xl font-poppins">80</h4>
          <p className="font-poppins font-medium">Overall rank</p>
      </div>
    </div>
    </div>
  );
};

export default OverView;
