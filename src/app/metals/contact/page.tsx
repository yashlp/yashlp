"use client";

import { FormEvent, useState } from "react";
import { COMPANY } from "@/lib/metals/catalog";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const body = `Name: ${name}\nPhone: ${phone}\n\n${message}`;
    window.location.href = `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(body)}`;
  }

  return (
    <div className="jk-page">
      <p className="jk-kicker">Contact</p>
      <h1>Talk to the floor.</h1>
      <p className="jk-lead">
        Kamlesh Jagetiya · {COMPANY.addressLine}, {COMPANY.city}
      </p>
      <div className="jk-quote-grid">
        <form className="jk-form" onSubmit={onSubmit}>
          <div>
            <div className="jk-label">Name</div>
            <input className="jk-field" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <div className="jk-label">Phone</div>
            <input
              className="jk-field"
              required
              maxLength={20}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <div className="jk-label">What do you need</div>
            <textarea
              className="jk-field"
              required
              minLength={8}
              maxLength={2000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Grade, size, length, quantity"
            />
          </div>
          <button className="jk-btn jk-btn-solid" type="submit">
            Open WhatsApp
          </button>
        </form>
        <div>
          <p className="jk-kicker">Direct</p>
          <p style={{ marginTop: 12 }}>
            <a href={`tel:${COMPANY.phonePrimaryTel}`}>{COMPANY.phonePrimary}</a>
          </p>
          <p style={{ marginTop: 8 }}>
            <a href={`tel:${COMPANY.phoneSecondaryTel}`}>{COMPANY.phoneSecondary}</a>
          </p>
          <p style={{ marginTop: 8 }}>
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </p>
          <p style={{ marginTop: 18, color: "#8a8a8a", fontSize: 14 }}>
            GST {COMPANY.gst}. Walk-ins at Makarpura GIDC during working hours.
          </p>
        </div>
      </div>
    </div>
  );
}
