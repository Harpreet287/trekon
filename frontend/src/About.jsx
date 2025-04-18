import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Trekon</h1>
        <div className="header-underline"></div>
      </header>

      <section className="about-content">
        <div className="about-card mission-card">
          <h2>Our Mission</h2>
          <p>
            At Trekon, we're dedicated to revolutionizing the way people connect with technology.
            Our platform is designed to make complex tech solutions accessible, intuitive, and
            effective for businesses of all sizes.
          </p>
        </div>

        <div className="about-sections">
          <div className="about-card">
            <h2>Who We Are</h2>
            <p>
              Founded in 2023, Trekon brings together a team of passionate innovators and
              problem-solvers. We believe in creating technology that enhances human capabilities
              rather than replacing them.
            </p>
            <p>
              Our diverse team combines expertise in AI, machine learning, user experience design,
              and enterprise solutions to deliver a platform that truly understands and addresses
              your needs.
            </p>
          </div>

          <div className="about-card">
            <h2>Our Approach</h2>
            <p>
              We take a user-centered approach to development, focusing on creating intuitive
              interfaces that make powerful technology accessible to everyone. Our solutions are:
            </p>
            <ul className="feature-list">
              <li>
                <span className="feature-icon">✓</span>
                <span className="feature-text">Intuitive and easy to use</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span className="feature-text">Secure and reliable</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span className="feature-text">Scalable for businesses of all sizes</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span className="feature-text">Continuously evolving with your needs</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            {/* Team member cards would go here in a real implementation */}
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>Jane Doe</h3>
              <p>Founder & CEO</p>
            </div>
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>John Smith</h3>
              <p>CTO</p>
            </div>
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>Alex Johnson</h3>
              <p>Lead Developer</p>
            </div>
            <div className="team-member">
              <div className="member-avatar"></div>
              <h3>Sam Taylor</h3>
              <p>UX Designer</p>
            </div>
          </div>
        </div>

        <div className="about-card contact-card">
          <h2>Get in Touch</h2>
          <p>
            We'd love to hear from you! Whether you have questions about our platform,
            want to provide feedback, or are interested in partnering with us, our team
            is here to help.
          </p>
          <div className="contact-button-container">
            <button className="contact-button">Contact Us</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

