"use client";

import React, { useState, useRef, useEffect } from "react";

const clients = [
  "Alice Johnson",
  "Ali Khan",
  "Amit Sharma",
  "Ananya Mehta",
  "Bob Singh",
];

export default function MentionTextarea() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mentionStart, setMentionStart] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef();
  const mirrorRef = useRef();

  useEffect(() => {
    if (mentionStart != null) updateMentionPosition();
  }, [mentionStart, text]);

  const updateMentionPosition = () => {
    const textarea = textareaRef.current;
    const mirror = mirrorRef.current;

    const valueUpToCursor = text.slice(0, textarea.selectionStart);
    mirror.innerText = valueUpToCursor.replace(/\n$/, "\n."); // avoid collapsing newline

    const span = document.createElement("span");
    span.innerText = ".";
    mirror.appendChild(span);

    const { offsetTop, offsetLeft } = span;
    setMentionPosition({ top: offsetTop + 20, left: offsetLeft });
    mirror.removeChild(span);
  };

  const handleChange = (e) => {
    const cursor = e.target.selectionStart;
    const value = e.target.value;
    setText(value);

    const textUpToCursor = value.slice(0, cursor);
    const match = textUpToCursor.match(/@(\w*)$/);

    if (match) {
      const query = match[1].toLowerCase();
      const matchedClients = clients.filter((client) =>
        client.toLowerCase().includes(query)
      );
      setSuggestions(matchedClients);
      setMentionStart(cursor - query.length - 1);
      setSelectedIndex(0);
    } else {
      setSuggestions([]);
      setMentionStart(null);
    }
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      const selectedClient = suggestions[selectedIndex];
      if (selectedClient) {
        e.preventDefault();
        handleSuggestionClick(selectedClient);
      }
    }
  };

  const handleSuggestionClick = (clientName) => {
    if (mentionStart == null) return;

    const before = text.slice(0, mentionStart);
    const after = text.slice(textareaRef.current.selectionStart);
    const newText = `${before}@${clientName} ${after}`;

    setText(newText);
    setSuggestions([]);
    setMentionStart(null);

    setTimeout(() => {
      textareaRef.current.focus();
      const pos = (before + "@" + clientName + " ").length;
      textareaRef.current.setSelectionRange(pos, pos);
    }, 0);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div
        className="absolute invisible whitespace-pre-wrap break-words p-4 border border-base-300 rounded-lg text-base"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          width: "100%",
          visibility: "hidden",
          zIndex: -1,
          pointerEvents: "none",
        }}
        ref={mirrorRef}
      />
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={6}
        placeholder="Type @ to mention a client..."
        className="w-full p-4 text-base border border-base-300 rounded-lg focus:outline-none"
        style={{ lineHeight: "1.5", fontFamily: "inherit" }}
      />

      {suggestions.length > 0 && (
        <ul
          className="absolute z-50 border border-base-300 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto transition"
          style={{
            top: mentionPosition.top,
            left: mentionPosition.left,
          }}
        >
          {suggestions.map((client, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(client)}
              className={`px-4 py-2 cursor-pointer transition hover:bg-base-200 hover:text-base-content ${
                selectedIndex === index ? "bg-base-200 text-base-content" : ""
              }`}
            >
              {client}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
