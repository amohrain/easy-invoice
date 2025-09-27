const InvoiceSkeleton = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-6 w-full max-w-5xl self-center">
        <div className="flex flex-col w-full border shadow rounded-lg p-6 h-fit animate-pulse space-y-8">
          {/* Header */}
          <div className="flex w-full justify-between items-center">
            <div className="h-8 w-48 bg-gray-300 rounded-xl"></div>
            <div className="flex gap-4 items-center">
              <div className="h-8 w-8 bg-gray-300 rounded-xl"></div>
              <div className="h-8 w-8 bg-gray-300 rounded-xl"></div>
              <div className="h-8 w-8 bg-gray-300 rounded-xl"></div>
              {/* <div className="h-9 w-20 bg-gray-300 rounded-xl-full"></div>
                <div className="h-9 w-28 bg-gray-300 rounded-xl-full"></div> */}
            </div>
          </div>

          {/* Logo & Company Info */}
          <div className="flex justify-between items-start">
            <div className="space-y-3"></div>
            <div className="space-y-3 text-right">
              <div className="h-14 w-28 bg-gray-300 rounded-xl ml-auto"></div>
              <div className="h-6 w-48 bg-gray-300 rounded-xl ml-auto"></div>
              <div className="h-6 w-48 bg-gray-300 rounded-xl ml-auto"></div>
              <div className="h-6 w-48 bg-gray-300 rounded-xl ml-auto"></div>
            </div>
          </div>

          <hr />

          {/* Bill To + Invoice Info */}
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="h-6 w-24 mb-4 bg-gray-300 rounded-xl"></div>
              <div className="h-6 w-44 bg-gray-300 rounded-xl"></div>
              <div className="h-6 w-44 bg-gray-300 rounded-xl"></div>
              <div className="h-6 w-44 bg-gray-300 rounded-xl"></div>
              <br />
              <div className="h-6 w-44 bg-gray-300 rounded-xl"></div>
              <div className="h-6 w-44 bg-gray-300 rounded-xl"></div>
            </div>
            <div className="self-end space-y-3">
              <div className="h-6 w-44 bg-gray-300 rounded-xl"></div>
              <div className="h-6 w-44 bg-gray-300 rounded-xl"></div>
            </div>
          </div>

          {/* Table */}
          <div>
            <div className="grid grid-cols-6 gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="contents">
                  <div className="h-8 rounded-xl bg-gray-200 col-span-3 border border-gray-200"></div>
                  <div className="h-8 rounded-xl bg-gray-200 col-span-1 border border-gray-200"></div>
                  <div className="h-8 rounded-xl bg-gray-200 col-span-1 border border-gray-200"></div>
                  <div className="h-8 rounded-xl bg-gray-200 col-span-1 border border-gray-200"></div>
                  {/* <div className="h-10 bg-gray-200 col-span-1 border border-gray-200"></div>
                    <div className="h-10 bg-gray-200 col-span-1 border border-gray-200"></div>
                    <div className="h-10 bg-gray-200 col-span-1 border border-gray-200"></div> */}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 mt-6 w-72 ml-auto text-right">
              <div className="h-6 w-full bg-gray-200 rounded-xl ml-auto"></div>
              <div className="h-6 w-full bg-gray-200 rounded-xl ml-auto"></div>
              <div className="h-6 w-full bg-gray-200 rounded-xl ml-auto"></div>
              <div className="h-7 w-full bg-gray-300 rounded-xl ml-auto"></div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <div className="h-6 w-24 bg-gray-300 rounded-xl"></div>
            <div className="h-6 w-56 bg-gray-200 rounded-xl"></div>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-3">
            <div className="h-6 w-48 bg-gray-300 rounded-xl"></div>
            <div className="h-6 w-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
        {/* Footer */}
        <div className="h-6 w-80 bg-gray-200 rounded-xl mx-auto animate-pulse mt-4"></div>
      </div>
    </div>
  );
};

export default InvoiceSkeleton;
