import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useClientStore } from "@/store/useClient";
import { InvoicePreview } from "./InvoicePreview";
import { handleInvoiceGenerate } from "../lib/openai";
import { useInvoiceStore } from "../store/useInvoice";
import { calculateInvoice } from "../lib/calculate";
import { sampleCompany } from "../constants/sampleCompany";
import { clients } from "../constants/clients";
import { templates } from "../lib/templatesData";
import { useTemplateStore } from "../store/useTemplate";
import { dummyInvoice } from "../lib/dummyInvoice";
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
  const [isVisible, setIsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [mentionStart, setMentionStart] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const { setClientId, getClients, clients, clientId, setSampleClients } =
    useClientStore();
  const { invoice, setInvoice } = useInvoiceStore();
  const { setTemplate } = useTemplateStore();

  const timeToStart = 1000; // 1 second
  const textareaRef = useRef();
  const mirrorRef = useRef();

  useEffect(() => {
    async function fetchClients() {
      //   await getClients();
      setSampleClients();
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

  const startTyping = () => {
    if (text !== "") return;
    setClientId("");
    let i = 0;
    const textToType =
      placeholders[Math.floor(Math.random() * placeholders.length)];
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
    setMentionPosition({
      top: offsetTop + 24,
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
    const mentionTag = `@${client.clientName}\n`;
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
      //   const invoice = dummyInvoice;
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
      <div className="fixed inset-0 bg-base-100 flex flex-col items-center justify-center z-50 overflow-y-auto">
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
    );
  };

  if (step === 2) {
    return <PreviewModal />;
  }

  return (
    <div
      className="flex w-full max-w-2xl mx-auto p-4 rounded-2xl h-48 shadow-2xl shadow-primary/40 
        bg-base-100/10 backdrop-blur-sm border border-primary/20 
        animate-pulse-soft"
    >
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
        placeholder={placeholder}
        // rows={1}
        // onInput={(e) => {
        //   e.target.style.height = "40px";
        //   e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
        // }}
        className="w-full outline-0 h-36 resize-none"
      />
      <button
        onClick={() => {
          handleGenerate();
        }}
        className="self-end btn btn-md bg-gradient-to-tr from-secondary via-secondary/85 to-primary rounded-full shadow-lg hover:scale-105 transition text-white border-none"
      >
        <Sparkles size={18} /> Generate
      </button>

      {suggestions.length > 0 && (
        <ul
          className="absolute z-50  border-base-300 rounded-lg shadow-lg max-h-44 overflow-y-auto w-72"
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
