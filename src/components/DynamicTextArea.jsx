import { Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useClientStore } from "@/store/useClient";
import { InvoicePreview } from "./InvoicePreview";
import { handleInvoiceGenerate } from "../lib/openai";
import { useInvoiceStore } from "../store/useInvoice";
import { calculateInvoice } from "../lib/calculate";
import { sampleCompany } from "../constants/sampleCompany";
import { templates } from "../lib/templatesData";
import { useTemplateStore } from "../store/useTemplate";
import InvoiceSkeleton from "./InvoiceSkeleton";

export const DynamicTextarea = () => {
  const placeholders = [
    "@Alice Johnson\n5 Website Designs @ 400\n2 Logos @ 100\ndiscount @ 5%\nGST-18%",
    "@Bob Smith\n3 Mobile App Screens @ 500\n1 Logo @ 150\nVAT-12%",
    "@Catherine Lee\n10 Social Media Posts @ 50\nBrand Guidelines @ 300\ndiscount @ 10%\nService Tax-15%",
    "@Daniel Chen\nConsultation (2 hrs) @ 100\nUI Audit @ 200\nGST-18%",
    "@Eva Williams\n3 Flyers @ 75\n1 Brochure @ 120\ndiscount @ 7%\nVAT-10%",
    "@Farhan Mehta\n1 Landing Page @ 800\nLogo Revamp @ 150\nService Tax-14%",
    "@Gina Torres\nSEO Audit @ 250\nKeyword Plan @ 150\nNo Tax",
    "@Harish Patel\nFull Website Redesign @ 1000\ndiscount @ 8%\nGST-18%",
  ];
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [mentionStart, setMentionStart] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const { setClientId, getClients, clients, clientId, setSampleClients } =
    useClientStore();
  const { invoice, setInvoice } = useInvoiceStore();
  const { setTemplate } = useTemplateStore();

  const [tooltip, setTooltip] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);

  const [startTime, setStartTime] = useState(0);

  const timeToStart = 1000; // 1 second
  const textareaRef = useRef();
  const mirrorRef = useRef();

  // Logic for tooltip
  const updateTooltipPosition = () => {
    const lines = text.split("\n");

    // Tooltip position: just below caret line
    setTooltip({
      // top: rect.bottom - taRect.top + textarea.scrollTop,
      top: Math.min(lines.length * 24, 140),
      left: 20,
    });
  };

  // Update tooltip content on text change
  useEffect(() => {
    updateTooltipPosition();

    // start counting time when the user starts typing for the first time
    if (text.length > 0 && startTime === 0) {
      const start = performance.now();
      setStartTime(start);
    }
    if (text.length === 0) {
      setStartTime(0);
    }

    if (text.trim() === "") {
      setClientId("");
      setTooltipContent(
        <span className="text-secondary">
          Type <span className="text-primary italic">'@Name'</span> to quickly
          add a client
        </span>
      );
      return;
    }

    if (!clientId) {
      setTooltipContent(
        <span className="text-secondary">
          Type <span className="text-primary italic">'@Name'</span> to mention a
          client
        </span>
      );
    } else if (text.split("\n").length == 2) {
      setTooltipContent(
        <span className="text-primary">
          Add items like{" "}
          <span className="text-secondary italic">'3 Logos @ 49.99'</span>
        </span>
      );
    } else if (text.split("\n").length == 3) {
      setTooltipContent(
        <span className="text-primary">
          Add extras like{" "}
          <span className="text-secondary italic">'VAT-10%'</span> or
          <span className="text-secondary italic"> 'discount @ 5%'</span>
        </span>
      );
    } else if (text.split("\n").length == 4) {
      setTooltipContent(
        <span className="text-secondary">
          Click <span className="text-primary italic">'Generate'</span>
        </span>
      );
    }
  }, [text]);

  const handleTooltipClicked = () => {
    if (!clientId) {
      const firstClient = clients[0];
      if (firstClient) insertMention(firstClient);
    } else if (text.split("\n").length == 2) {
      setText((prev) => prev.trim() + "\n3 Logos @ 49.99\n");
      textareaRef.current.focus();
    } else if (text.split("\n").length == 3) {
      setText((prev) => prev.trim() + "\nVAT-10%\n");
      textareaRef.current.focus();
    } else if (text.split("\n").length == 4) {
      handleGenerate();
    }
  };

  // Bad logic for tooltip timing
  useEffect(() => {
    if (text.trim() !== "") setShowTooltip(true);
  }, [showTooltip == false]);

  useEffect(() => {
    async function fetchClients() {
      //   await getClients();
      await setSampleClients();
      setClientId("");
      setTemplate(templates[0]);
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

  useEffect(() => {
    if (step == 1) document.body.style.overflow = "";
    else document.body.style.overflow = "hidden";
  }, [step]);

  useEffect(() => {
    if (!isVisible) return;

    let timeoutId;
    let lastIndex = -1;

    const rotatePlaceholder = () => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * placeholders.length);
      } while (nextIndex === lastIndex && placeholders.length > 1);

      lastIndex = nextIndex;
      const nextText = placeholders[nextIndex];

      setPlaceholder(""); // clear first

      // pause before typing
      timeoutId = setTimeout(() => {
        let i = 0;
        const interval = setInterval(() => {
          if (i < nextText.length) {
            setPlaceholder(nextText.substring(0, i + 1));
            i++;
          } else {
            clearInterval(interval);
            // schedule next rotation *after* finishing
            timeoutId = setTimeout(rotatePlaceholder, 2000); // wait before typing next
          }
        }, 40);
      }, 2000);
    };

    rotatePlaceholder(); // kickstart

    return () => clearTimeout(timeoutId);
  }, [isVisible]);

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
    setMentionPosition({
      top: offsetTop + 36,
      //  left: offsetLeft
    });
    mirror.removeChild(span);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    const cursor = e.target.selectionStart;
    const beforeCursor = value.slice(0, cursor);
    const match = beforeCursor.match(/@(\w*)$/);

    if (match && !clientId) {
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
    const mentionTag = `@${client.clientName}\n`;
    const newText = `${before}${mentionTag} ${after}`;
    setClientId(client._id);
    setText(newText);
    setSuggestions([]);
    setMentionStart(null);
    setTimeout(() => {
      const pos = (before + mentionTag + "").length;
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

  const handleGenerate = async () => {
    if (clientId === "") {
      alert("Please mention a client typing '@' followed by their name.");
      return;
    }

    try {
      setLoading(true);
      setStep(2);

      const invoiceInfo = {
        issuedAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        template: "vibe",
        invoiceNumber: "INV-001",
        notes: "Thank you for your business!",
        paymentInstructions: "Please make the payment by the due date.",
        dueDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      const invoice = await handleInvoiceGenerate(text);

      // Calculate time taken to generate invoice
      const end = performance.now();
      const durationInSeconds = ((end - startTime) / 1000).toFixed(2);
      invoice.timeTaken = parseFloat(durationInSeconds);

      const updatedInvoice = calculateInvoice(invoice);
      const clientInfo = clients.find((client) => client._id === clientId);
      setInvoice({
        ...updatedInvoice,
        ...clientInfo,
        ...sampleCompany,
        ...invoiceInfo,
      });
      setLoading(false);
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.log("Error generating invoice: ", error);
    }
  };

  const PreviewModal = () => {
    return (
      <div className="fixed py-4 vibe-gradient inset-0 bg-base-100 flex flex-col items-center justify-center z-50">
        <div className="w-full max-w-5xl rounded-xl h-full overflow-y-auto">
          {loading ? (
            <InvoiceSkeleton />
          ) : (
            <InvoicePreview
              setStep={() => setStep(1)}
              preview={true}
              editable={true}
            />
          )}
        </div>
      </div>
    );
  };

  if (step === 2) {
    return <PreviewModal />;
  }

  return (
    <div
      className="relative dropdown dropdown-top dropdown-open flex flex-col w-full max-w-2xl mx-auto py-4 px-4 md:px-6 rounded-2xl h-48 shadow-2xl shadow-secondary/20 
        bg-base-100/20 backdrop-blur-sm border border-primary/20 
        animate-pulse-soft "
    >
      <div
        hidden={!showTooltip || suggestions.length > 0}
        id="tooltip"
        onClick={handleTooltipClicked}
        draggable
        className="absolute rounded border backdrop-blur-xs border-primary/30 font-semibold text-sm vibe-opacity py-2 px-4 z-50 cursor-pointer"
        style={{
          top: tooltip?.top + 24 || 0, // small offset below line
          left: tooltip?.left - 5 || 0,
          transition: "top 0.2s, left 0.2s",
        }}
      >
        <span className=" animate-pulse flex items-center gap-2">
          <Sparkles className="text-primary" size={16} />
          {tooltipContent}
        </span>
        <div
          className=""
          style={{
            position: "absolute",
            top: "-6px",
            left: "5px",
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderBottom: "6px solid",
          }}
        />
      </div>

      <div className="absolute animate-pulse badge badge-primary rounded-none rounded-bl-[15px] rounded-tr-[15px] opacity-70 flex bottom-0 left-0">
        <span className="italic font-extralight">interactive demo</span>
      </div>
      <div
        className="absolute invisible whitespace-pre-wrap break-words p-4 border border-base-300 rounded-lg text-base"
        ref={mirrorRef}
        style={{
          left: 0,
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
        placeholder={!showTooltip ? placeholder : ""}
        onFocus={() => {
          if (text === "") setShowPlaceholder(false);
          setShowTooltip(true);
        }}
        onBlur={() => {
          if (text === "") {
            setTimeout(() => {
              setPlaceholder("");
              setShowPlaceholder(true);
              setShowTooltip(false);
            }, 300);
          }
        }}
        className="w-full outline-0 h-36 resize-none text font-medium placeholder:font-normal placeholder:text-primary/50"
      />
      <button
        onClick={() => {
          handleGenerate();
        }}
        className="absolute bottom-4 self-end sm:btn-lg generate-button hover:scale-105 animate-pulse"
      >
        <Sparkles size={18} /> Generate
      </button>
      {!clientId && suggestions.length > 0 && (
        <ul
          className="absolute flex flex-col gap-1 z-50 border p-1 glass border-base-300 rounded-xl max-h-46 overflow-y-auto w-64"
          style={{
            top: mentionPosition.top,
            left: mentionPosition.left,
          }}
        >
          {suggestions.map((client, idx) => (
            <li
              key={client._id}
              onClick={() => insertMention(client)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition hover:bg-secondary/40 ${
                selectedIndex === idx
                  ? "bg-secondary/20 rounded-lg"
                  : "bg-base-100/50 border-base-100"
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
