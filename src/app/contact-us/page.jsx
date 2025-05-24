import Footer from "../../sections/Footer";
export default function Page() {
  return (
    <>
      <div className="h-[calc(100vh-280px)] py-12 px-24 mx-auto">
        <h1 className="text-xl text-center font-bold mb-4">Contact me</h1>

        <p className="text-lg mb-4">
          <span className="font-semibold">Email: </span>{" "}
          abhishek@vibeinvoice.com
        </p>
        <p className="text-lg mb-4">
          <span className="font-semibold">Twitter: </span> x.com/abhi_crimson
        </p>
        <p className="text-lg mb-4">
          <span className="font-semibold">
            Feel free to reach out to us with any queries or concerns. We’re
            available between operational hours 9 AM–6 PM, Monday–Saturday.
          </span>
        </p>
      </div>
      <Footer />
    </>
  );
}
