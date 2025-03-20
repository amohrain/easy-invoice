import { useState, useEffect, useRef } from "react";

const TypingPlaceholder = ({ text, setText }) => {
  const aiText = `Chapter 1 at page 3\n-Chapter 1.1 pg. 2\nChapter 2 @ 3\n\nAlso fix my typos and structure in a hierarchy`;
  const nonAiText = `Chapter 1\n1\n-Chapter 1.1\n2\nChapter 2\n3`;

  const [placeholder, setPlaceholder] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const textareaRef = useRef(null);

  // Observe when the component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // Trigger when at least 20% is visible
    );

    if (textareaRef.current) {
      observer.observe(textareaRef.current);
    }

    return () => {
      if (textareaRef.current) {
        observer.unobserve(textareaRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return; // Start typing only when visible

    let i = 0;
    const textToType = aiText;

    setPlaceholder(""); // Clear previous placeholder before starting

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < textToType.length) {
          setPlaceholder(textToType.substring(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }, 0); // Delay before starting

    return () => {
      clearTimeout(timeout);
    };
  }, [text]);

  return (
    <textarea
      ref={textareaRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      className={`textarea text-[18px] textarea-ghost w-full focus:outline-none resize-none overflow-y-auto min-h-[200px] max-h-[300px]`}
      placeholder={placeholder}
      rows={1}
      onInput={(e) => {
        e.target.style.height = "40px"; // Reset height
        e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`; // Grow dynamically but stop at 300px
      }}
    />
  );
};

export default TypingPlaceholder;
