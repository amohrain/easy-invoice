import React, { useState } from "react";
import {
  Undo2,
  Save,
  Download,
  Link2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import DownloadIcon from "../DownloadIcon";

const FixedBottomBar = ({ onBack, onSave, onLinkShare, currentPath }) => {
  return (
    <div className="fixed top-10 bg-base-300/50 hover:bg-base-300/90 transition-colors w-xs shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-row justify-around gap-4 items-center">
          <Undo2
            size={24}
            className="cursor-pointer hover:text-accent"
            onClick={onBack}
          />

          <Save
            size={24}
            className="cursor-pointer hover:text-accent"
            onClick={onSave}
          />

          <DownloadIcon />

          {currentPath !== "/invoices/create" && (
            <Link2
              size={24}
              className="cursor-pointer hover:text-purple-400 transition-colors"
              onClick={onLinkShare}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FixedBottomBar;
