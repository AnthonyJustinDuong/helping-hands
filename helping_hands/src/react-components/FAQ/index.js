import React from "react";
import "./styles.css";
import Accordion from "./QnaAccordion/index.js";

/* The FAQ Component */
class FAQ extends React.Component {
  state = {
    qna: [
      {
        question: "How does it work?",
        answer:
          "Once you have created an account, you can create a request in the “Help Needed” section. When a volunteer contacts you, you can then pay them through PayPal or Interac e-transfer, and they will deliver your order directly to your door.",
      },

      {
        question: "Are there any additional fees?",
        answer:
          "There are no additional fees. You will only pay the required amount for the volunteers to purchase the items in your order.",
      },

      {
        question: "How do I earn points?",
        answer:
          "Volunteer to fulfill requests on the “Help Needed” section. Each request fulfilled is worth 10 points. When you earn 50 points within one week, you will earn 5 bonus points. Volunteers with the most points will appear on their respective community-based leaderboards.",
      },

      {
        question: "How should volunteers interact with individuals?",
        answer:
          "As per the guidelines of the World Health Organization (WHO) and the Canadian government, volunteers should maintain at least a 2-meter physical distance from delivery recipients. Items must be delivered contactless. As the deliveries are already paid for online, we recommend the volunteers simply leave the delivered items near the recipent's doorstep, ring the doorbell and step back at least 2 meters. Once the recipient opens the door, the volunteers can greet them, make sure the recipients recieve their items and leave. Here is a link to Canada's guidelines for social distancing: https://www.canada.ca/en/public-health/services/publications/diseases-conditions/social-distancing.html",
      },
    ],
  };

  render() {
    return (
      <div className="faq">
        {/* <div className="prompt">
          Browse through some frequently asked questions below.
        </div> */}
        {this.state.qna.map((item, index) => {
          return (
            <Accordion
              key={index}
              question={item.question}
              answer={item.answer}
            />
          );
        })}
      </div>
    );
  }
}

export default FAQ;
