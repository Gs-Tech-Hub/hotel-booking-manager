import Image from "next/image";

const Loader = () => {
  return (
    <div className="loader_bg">
      <div className="loader">
        <Image  
          src="/images/loading.gif"  // ✅ Correct path
          alt="Loading..." 
          width={50}
          height={50} 
        />
      </div>
    </div>
  );
};

export default Loader;

