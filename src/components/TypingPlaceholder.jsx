import { useState, useEffect, useRef } from "react";
import { useClientStore } from "@/store/useClient";
import { usePathname } from "next/navigation";

const TypingPlaceholder = ({ text, setText }) => {
  const aiText = [
    "@Alice Johnson\n\n5 Website Designs @ 400\n2 Logos @ 100\n\ndiscount @ 5%\nGST-18%",
    "@Bob Smith\n\n3 Mobile App Screens @ 500\n1 Logo @ 150\n\nVAT-12%",
    "@Catherine Lee\n\n10 Social Media Posts @ 50\nBrand Guidelines @ 300\n\ndiscount @ 10%\nService Tax-15%",
    "@Daniel Chen\n\nConsultation (2 hrs) @ 100\nUI Audit @ 200\n\nGST-18%",
    "@Eva Williams\n\n3 Flyers @ 75\n1 Brochure @ 120\n\ndiscount @ 7%\nVAT-10%",
    "@Farhan Mehta\n\n1 Landing Page @ 800\nLogo Revamp @ 150\n\nService Tax-14%",
    "@Gina Torres\n\nSEO Audit @ 250\nKeyword Plan @ 150\n\nNo Tax",
    "@Harish Patel\n\nFull Website Redesign @ 1000\n\ndiscount @ 8%\nGST-18%",
  ];

  const currentPath = usePathname();

  const [placeholder, setPlaceholder] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [mentionStart, setMentionStart] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const { setClientId, getClients, clients } = useClientStore();

  const timeToStart = currentPath === "/playground" ? 500 : 2000; // 2 seconds
  const textareaRef = useRef();
  const mirrorRef = useRef();

  useEffect(() => {
    async function fetchClients() {
      await getClients();
    }
    fetchClients();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (textareaRef.current) observer.observe(textareaRef.current);

    return () => {
      if (textareaRef.current) observer.unobserve(textareaRef.current);
    };
  }, []);

  const startTyping = () => {
    if (text !== "") return;
    setClientId("");
    let i = 0;
    const textToType =
      "//Sample prompt\n\n" + aiText[Math.floor(Math.random() * aiText.length)];
    setPlaceholder("");

    const interval = setInterval(() => {
      if (i < textToType.length) {
        setPlaceholder(textToType.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
  };

  useEffect(() => {
    if (isVisible && text !== "") setPlaceholder("");
    if (isVisible && text === "") {
      setTimeout(() => {
        startTyping();
      }, timeToStart);
    }
  }, [isVisible, text]);

  // Mention handling
  useEffect(() => {
    if (mentionStart != null) updateMentionPosition();
  }, [mentionStart, text]);

  const updateMentionPosition = () => {
    const mirror = mirrorRef.current;
    const valueUpToCursor = text.slice(0, textareaRef.current.selectionStart);
    mirror.innerText = valueUpToCursor.replace(/\n$/, "\n.");

    const span = document.createElement("span");
    span.textContent = ".";
    mirror.appendChild(span);

    const { offsetTop, offsetLeft } = span;
    setMentionPosition({ top: offsetTop + 24, left: offsetLeft });
    mirror.removeChild(span);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    const cursor = e.target.selectionStart;
    const beforeCursor = value.slice(0, cursor);
    const match = beforeCursor.match(/@(\w*)$/);

    if (match) {
      const query = match[1].toLowerCase();
      const matched = clients.filter((client) =>
        client.clientName.toLowerCase().includes(query)
      );
      setSuggestions(matched);
      setMentionStart(cursor - match[1].length - 1);
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
      setSelectedIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i === 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      const selected = suggestions[selectedIndex];
      if (selected) {
        e.preventDefault();
        insertMention(selected);
      }
    }
  };

  const insertMention = (client) => {
    const before = text.slice(0, mentionStart);
    const after = text.slice(textareaRef.current.selectionStart);
    const mentionTag = `@${client.clientName}\n${client.clientEmail}\n\n`;
    const newText = `${before}${mentionTag} ${after}`;
    setClientId(client._id);
    setText(newText);
    setSuggestions([]);
    setMentionStart(null);
    setTimeout(() => {
      const pos = (before + mentionTag + " ").length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(pos, pos);
    }, 0);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative w-full">
      <div
        className="absolute invisible whitespace-pre-wrap break-words p-4 border border-base-300 rounded-lg text-base"
        ref={mirrorRef}
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          width: "100%",
          visibility: "hidden",
          zIndex: -1,
        }}
      />
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="textarea text-[18px] textarea-ghost w-full focus:outline-none resize-none overflow-y-auto min-h-[200px] max-h-[300px]"
        placeholder={placeholder}
        rows={1}
        onInput={(e) => {
          e.target.style.height = "40px";
          e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
        }}
      />

      {suggestions.length > 0 && (
        <ul
          className="absolute z-50 border border-base-300 rounded-lg shadow-lg max-h-44 overflow-y-auto w-72"
          style={{
            top: mentionPosition.top,
            left: mentionPosition.left,
          }}
        >
          {suggestions.map((client, idx) => (
            <li
              key={client._id}
              onClick={() => insertMention(client)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition ${
                selectedIndex === idx
                  ? "bg-base-300 border rounded-lg"
                  : "bg-base-100 border border-base-100"
              }`}
            >
              <div className="bg-neutralrounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {getInitials(client.clientName)}
              </div>
              <div>
                <div className="font-medium">{client.clientName}</div>
                <div className="text-xs text-gray-500">
                  {client.clientEmail}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TypingPlaceholder;
