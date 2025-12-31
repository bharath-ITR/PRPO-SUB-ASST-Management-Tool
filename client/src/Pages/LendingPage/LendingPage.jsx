import FullLogo from '../../components/Assist/FullLogo.png';
import Login from '../../components/Login/Login';
import PR_PO_bg from '../../components/Assist/PR_PO_bg.jpg';

const LendingPage = () => {
  const bgImageUrl = PR_PO_bg;

  return (
    <div className="flex w-full min-h-screen" style={{ backgroundColor: 'whitesmoke' }}>
      {/* Left container with background image and gradient */}
      <div
        className="w-3/5 h-screen flex flex-col"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.1)), url(${bgImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="p-5 h-12 flex items-center">
          <img src={FullLogo} alt="Logo" className="h-14 object-cover" />
        </div>
        <div className="flex flex-col items-center justify-center flex-grow px-6 text-center text-white">
          <h1 className="text-4xl mb-5 text-[#ea7325] font-semibold">Welcome to PR/PO</h1>
          <p className="max-w-xl text-lg leading-relaxed text-[#fffafa]">
            Streamline your purchasing process with ease. Our portal is designed to simplify and automate purchase requisitions, making it quick and efficient to request, approve, and track your procurement needs. Whether you're managing routine supplies or special orders, our intuitive interface ensures that every request is processed smoothly and transparently.
          </p>
        </div>
      </div>

      {/* Right container */}
      <div className="w-2/5 flex items-center justify-center bg-white">
        <Login />
      </div>
    </div>
  );
};

export default LendingPage;
