import React from "react";
import { clients } from "../constants/clients";
import { getInitials } from "../lib/getInitials";

const suggestions = clients.slice(0, 5);

function HoverClientCard() {
  return (
    <ul
      tabIndex="-1"
      className="dropdown-content flex flex-col gap-1 z-150 border p-1 glass border-base-300 rounded-xl max-h-50.5 overflow-y-auto w-64"
    >
      {suggestions.map((client, idx) => (
        <li
          key={client._id}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition hover:bg-secondary/40 bg-base-100/50 border-base-100`}
        >
          <div className="bg-base-300 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {getInitials(client.clientName)}
          </div>
          <div>
            <div className="font-medium">{client.clientName}</div>
            <div className="text-xs text-gray-500">{client.clientEmail}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default HoverClientCard;
