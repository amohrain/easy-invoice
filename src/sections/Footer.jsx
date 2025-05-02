import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaTwitterSquare,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <aside className="flex flex-col items-center ">
        <img
          className="w-12 rounded-4xl"
          src="https://c5583aef704532e38c2df40901cb607e.cdn.bubble.io/f1732555537155x555955188179346500/IMG20230320134445.jpg"
          alt=""
        />
        <p>Developed by Abhishek Kumar</p>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a href="https://www.facebook.com/amohrain">
              <FaFacebook />
            </a>
            <a href="https://www.linkedin.com/in/abhishek-kumar-6b8850190/">
              <FaLinkedin />
            </a>
            <a>
              <FaYoutube />
            </a>
            <a href="https://www.instagram.com/abhiabhie/">
              <FaInstagram />
            </a>
            <a href="https://x.com/abhi_crimson">
              <FaXTwitter />
            </a>
          </div>
        </nav>
      </aside>
      <nav>
        <h6 className="footer-title">All Products</h6>
        <Link href="/" className="link link-hover">
          Vibe Invoice
        </Link>
        <Link href="https://www.bulkmark.in" className="link link-hover">
          Bulkmark
        </Link>
        <Link href="https://www.proker.io" className="link link-hover">
          Proker.io
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <Link href="/about-us" className="link link-hover">
          About
        </Link>
        <Link href="/contact-us" className="link link-hover">
          Contact
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <Link href="/terms" className="link link-hover">
          Terms of use
        </Link>
        <Link href="/refund-policy" className="link link-hover">
          Refund & cancellation policy
        </Link>
        <Link href="/privacy-policy" className="link link-hover">
          Privacy policy
        </Link>
        <Link href="/cookie-policy" className="link link-hover">
          Cookie policy
        </Link>
      </nav>
    </footer>
  );
}

export default Footer;
