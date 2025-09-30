const InvoiceSkeleton = () => {
  const background = "bg-gradient-to-r from-primary/15 to-secondary/10";

  return (
    <div className={`flex flex-col w-full h-full`}>
      <div className={`w-full rounded-lg vibe-opacity max-w-5xl self-center`}>
        <div
          className={`flex flex-col w-full shadow rounded-lg p-6 h-fit animate-pulse space-y-8`}
        >
          {/* Header */}
          <div className={`flex w-full justify-between items-center`}>
            <div className={`h-8 w-48 ${background} rounded-xl`}></div>
            <div className={`flex gap-4 items-center`}>
              <div className={`h-8 w-8 ${background} rounded-xl`}></div>
              <div className={`h-8 w-8 ${background} rounded-xl`}></div>
              <div className={`h-8 w-8 ${background} rounded-xl`}></div>
            </div>
          </div>

          {/* Logo & Company Info */}
          <div className={`flex justify-between items-start`}>
            <div className={`space-y-3`}></div>
            <div className={`space-y-3 text-right`}>
              <div
                className={`h-14 w-28 ${background} rounded-xl ml-auto`}
              ></div>
              <div
                className={`h-6 w-48 ${background} rounded-xl ml-auto`}
              ></div>
              <div
                className={`h-6 w-48 ${background} rounded-xl ml-auto`}
              ></div>
              <div
                className={`h-6 w-48 ${background} rounded-xl ml-auto`}
              ></div>
            </div>
          </div>

          <hr className={`border-dashed border-base-content/45`} />

          {/* Bill To + Invoice Info */}
          <div className={`flex justify-between items-start`}>
            <div className={`space-y-3`}>
              <div className={`h-6 w-24 mb-4 ${background} rounded-xl`}></div>
              <div className={`h-6 w-44 ${background} rounded-xl`}></div>
              <div className={`h-6 w-44 ${background} rounded-xl`}></div>
              <div className={`h-6 w-44 ${background} rounded-xl`}></div>
              <br />
              <div className={`h-6 w-44 ${background} rounded-xl`}></div>
              <div className={`h-6 w-44 ${background} rounded-xl`}></div>
            </div>
            <div className={`self-end space-y-3`}>
              <div className={`h-6 w-44 ${background} rounded-xl`}></div>
              <div className={`h-6 w-44 ${background} rounded-xl`}></div>
            </div>
          </div>

          {/* Table */}
          <div>
            <div className={`grid grid-cols-6 gap-2`}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`contents`}>
                  <div
                    className={`h-8 rounded-xl ${background} col-span-3`}
                  ></div>
                  <div
                    className={`h-8 rounded-xl ${background} col-span-1`}
                  ></div>
                  <div
                    className={`h-8 rounded-xl ${background} col-span-1`}
                  ></div>
                  <div
                    className={`h-8 rounded-xl ${background} col-span-1`}
                  ></div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className={`space-y-3 mt-6 w-72 ml-auto text-right`}>
              <div
                className={`h-6 w-full ${background} rounded-xl ml-auto`}
              ></div>
              <div
                className={`h-6 w-full ${background} rounded-xl ml-auto`}
              ></div>
              <div
                className={`h-6 w-full ${background} rounded-xl ml-auto`}
              ></div>
              <div
                className={`h-7 w-full ${background} rounded-xl ml-auto`}
              ></div>
            </div>
          </div>

          {/* Notes */}
          <div className={`space-y-3`}>
            <div className={`h-6 w-24 ${background} rounded-xl`}></div>
            <div className={`h-6 w-56 ${background} rounded-xl`}></div>
          </div>

          {/* Payment Instructions */}
          <div className={`space-y-3`}>
            <div className={`h-6 w-48 ${background} rounded-xl`}></div>
            <div className={`h-6 w-64 ${background} rounded-xl`}></div>
          </div>

          {/* Footer */}
          <div
            className={`h-6 w-80 ${background} rounded-xl mx-auto animate-pulse mt-4`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSkeleton;
