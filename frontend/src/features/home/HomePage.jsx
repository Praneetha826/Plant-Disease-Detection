import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../../components/common/Section.jsx";
import { submitFeedback } from "../../services/api.js";
import heroPlant from "../../assets/homeimg-copy.jpg";

const faqs = [
  {
    question: "How does the AI detect plant diseases?",
    answer:
      "The AI model analyzes the uploaded image and compares visible symptoms with disease patterns learned from plant image datasets.",
  },
  {
    question: "How accurate is the detection?",
    answer:
      "Accuracy depends on the model, image quality, lighting, and whether the affected leaf area is clearly visible.",
  },
  {
    question: "What should I do if the AI does not detect a disease?",
    answer:
      "Upload a clearer photo focused on the affected leaf. If symptoms continue, consult a plant specialist for confirmation.",
  },
];

export function HomePage({ navigate }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");

  async function handleFeedback(event) {
    event.preventDefault();
    if (!feedback.trim()) return;
    try {
      await submitFeedback(feedback);
      setFeedback("");
      setFeedbackStatus("Thank you for your feedback! It has been submitted.");
    } catch {
      setFeedbackStatus("Feedback is saved for the UI migration, but the API is not connected yet.");
    }
  }

  return (
    <>
      <main className="legacy-container home-container">
        <div className="main-content">
          <section id="home" className="home-section">
            <div className="content">
              <div className="info animate-in">
                <h2>Like Nature <br /><span>Be Creative!</span></h2>
                <p>
                  Welcome to PlantPulse, your trusted companion for detecting plant diseases
                  using AI. Upload a plant image and receive a diagnosis of potential diseases
                  so crops and garden plants can stay healthy.
                </p>
                <button className="info-btn" type="button" onClick={() => navigate("/upload")}>
                  Upload & Diagnose
                </button>
              </div>
            </div>
          </section>
          <div className="image hero-image">
            <img src={heroPlant} alt="A Monstera plant in a woven basket" />
          </div>
        </div>
      </main>

      <Section id="about-container">
        <h2>About PlantPulse</h2>
        <p>
          At PlantPulse, we aim to make plant healthcare easier through AI-powered diagnostics.
          The goal is to help farmers, gardeners, and plant enthusiasts detect plant diseases
          early and receive useful treatment recommendations.
        </p>
        <p>
          Plant diseases can reduce crop yield and plant health. Early detection and accurate
          identification can help prevent major losses and reduce manual inspection time.
        </p>
        <h3>How It Works:</h3>
        <div className="steps-text">
          Upload a clear image of the affected leaf.<br />
          The model analyzes the image for disease symptoms.<br />
          Receive a diagnosis report with suggested treatments.
        </div>
      </Section>

      <Section id="faq-container">
        <h2>Frequently Asked Questions</h2>
        <div className="accordion">
          {faqs.map((faq, index) => (
            <div className="accordion-item" key={faq.question}>
              <button
                className="accordion-button"
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                {faq.question}
                <ChevronDown size={18} className={openFaq === index ? "rotate" : ""} />
              </button>
              {openFaq === index && <div className="accordion-body">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </Section>

      <Section id="feedback-container">
        <h2>Feedback</h2>
        <p>
          We value your feedback! Let us know how we can improve the platform or share ideas
          for new features you would like to see.
        </p>
        <form className="feedback-form" onSubmit={handleFeedback}>
          <textarea
            rows="4"
            placeholder="Your feedback"
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
          />
          <button type="submit" className="info-btn">Submit Feedback</button>
        </form>
        {feedbackStatus && <p className="status-text">{feedbackStatus}</p>}
      </Section>

      <footer className="footer">
        <p>&copy; 2024 PlantPulse</p>
      </footer>
    </>
  );
}
