import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';

const DropletIcon = () => (
    <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"></path></svg>
);
const ShieldIcon = () => (
    <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const ZapIcon = () => (
    <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const EyeIcon = () => (
    <svg className="roadmap-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const AlertTriangleIcon = () => (
     <svg className="roadmap-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);
const ZapOffIcon = () => (
    <svg className="roadmap-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12.41 6.75 13 2 10.57 4.92"></polyline><polyline points="18.57 12.91 21 10 15.66 10"></polyline><polyline points="8 8 3 14 12 14 11 22 16 16"></polyline><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);
const BellIcon = () => (
    <svg className="roadmap-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
);
const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tech-icon"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);
const DatabaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tech-icon"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
);

const FlipCard = ({ icon, title, description, className = '' }) => (
    <div className={`flip-card ${className}`}>
        <div className="flip-card-inner">
            <div className="flip-card-front">
                {icon}
                <h3>{title}</h3>
            </div>
            <div className="flip-card-back">
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        </div>
    </div>
);

export default function Landing() {
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1
        });

        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    return (
        <div className="landing-wrapper">
            <section className="hero-section">
                <div className="hero-content">
                    <blockquote className="water-quote">
                        “Thousands have lived without love, not one without water.”
                        <span>- W. H. Auden</span>
                    </blockquote>
                    <h1 className="main-heading">HydroFlow Guardian</h1>
                    <p className="sub-heading">Smart Water Monitoring for Modern Poultry Farms</p>
                    <button onClick={() => navigate('/login')} className="cta-button">
                        Access Dashboard
                    </button>
                </div>
                <div className="hero-bg"></div>
            </section>

            <section id="about" className="content-section about-section">
                <div className="section-container">
                    <div className="about-content">
                        <h2 className="section-title">The Silent Cost of Water Wastage</h2>
                        <p className="section-paragraph">
                           In modern agriculture, efficiency is key. Yet, a significant and often overlooked expense in poultry farming is water loss from undetected leaks in pipeline systems. A minor drip can waste thousands of liters over time, inflating utility bills and straining a precious resource. HydroFlow Guardian was born from this challenge.
                        </p>
                        <p className="section-paragraph">
                            It's an intelligent, automated system designed to be your farm's first line of defense. By continuously monitoring pipeline flow, especially during the quiet of the night, it identifies costly leaks and inefficiencies the moment they begin. When an anomaly is detected, the system automatically intervenes, shutting off the valve to prevent further loss and protect your resources. It's a simple, powerful solution for a smarter, more sustainable farm.
                        </p>
                    </div>
                    <div className="about-image">
                         <img src="https://images.unsplash.com/photo-1561088339-3543b8764b8a?q=80&w=1974&auto=format&fit=crop" alt="Poultry Farm Water System" />
                    </div>
                </div>
            </section>
            
            <section id="features" className="content-section features-section">
                <h2 className="section-title">Core Features</h2>
                <div className="features-grid">
                   <FlipCard 
                        icon={<DropletIcon />}
                        title="Real-Time Analytics"
                        description="Our dashboard provides a live, second-by-second data stream of your water flow, allowing for precise management and immediate insights into consumption patterns."
                   />
                   <FlipCard 
                        icon={<ShieldIcon />}
                        title="Leak Detection"
                        description="Advanced algorithms analyze flow data 24/7. The system instantly flags continuous flow during non-peak hours, identifying potential leaks before they become major issues."
                   />
                   <FlipCard 
                        icon={<ZapIcon />}
                        title="Auto Cut-Off"
                        description="Upon detecting a leak, the smart valve automatically closes, preventing catastrophic water loss, protecting your infrastructure, and saving you money."
                   />
                </div>
            </section>
            
            <section className="content-section roadmap-section">
                <h2 className="section-title">How It Works: A Detailed Look</h2>
                <div className="river-flow-container">
                    <svg className="river-svg" viewBox="0 0 400 1200" preserveAspectRatio="xMidYMin meet">
                        <path className="river-path-bg" d="M 200,0 C 100,150 300,300 200,450 C 100,600 300,750 200,900 C 100,1050 200,1200 200,1200" />
                        <path className="river-path-flow" d="M 200,0 C 100,150 300,300 200,450 C 100,600 300,750 200,900 C 100,1050 200,1200 200,1200" />
                    </svg>
                    <div className="river-node" style={{ top: '3%', left:'80%' }}>
                        <FlipCard icon={<EyeIcon />} title="1. Monitor" description="High-precision sensors embedded in your pipelines constantly measure water flow." />
                    </div>
                    <div className="river-node" style={{ top: '32%' ,left: '12%'}}>
                        <FlipCard icon={<AlertTriangleIcon />} title="2. Detect" description="The system's AI compares real-time flow against pre-set schedules to find anomalies." />
                    </div>
                    <div className="river-node" style={{ top: '55%' }}>
                        <FlipCard icon={<ZapOffIcon />} title="3. Act" description="The smart valve controller receives the signal and instantly closes the pipeline." />
                    </div>
                    <div className="river-node" style={{ top: '78%',left: '10%' }}>
                        <FlipCard icon={<BellIcon />} title="4. Notify" description="A detailed report of the event is sent to your email, ensuring you're always informed." />
                    </div>
                </div>
            </section>

            <section className="content-section tech-stack-section">
                <h2 className="section-title">Powered by Modern Technology</h2>
                <div className="tech-grid">
                    <div className="tech-card">
                        <CodeIcon />
                        <h4>Frontend</h4>
                        <p>A sleek, responsive user interface built with <strong>React</strong> and <strong>Vite</strong> for lightning-fast performance.</p>
                    </div>
                    <div className="tech-card">
                        <DatabaseIcon />
                        <h4>Backend</h4>
                        <p>A robust and scalable server powered by <strong>Node.js</strong> and <strong>Express</strong>, ensuring reliable data processing.</p>
                    </div>
                </div>
            </section>

            <section className="content-section testimonials-section">
                <h2 className="section-title">What Our Users Say</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <p className="testimonial-quote">"HydroFlow Guardian saved us from a major pipeline burst. The instant notification and auto cut-off prevented a disaster. An essential tool for any modern farm."</p>
                        <p className="testimonial-author">- John D., Farm Owner</p>
                    </div>
                     <div className="testimonial-card">
                        <p className="testimonial-quote">"I was shocked to see how much water we were losing overnight. The dashboard made it crystal clear. Our water bills have dropped by 20% since installation."</p>
                        <p className="testimonial-author">- Sarah P., Operations Manager</p>
                    </div>
                </div>
            </section>

            <section id="contact" className="content-section cta-final-section">
                 <h2 className="section-title">Ready to Save Water and Money?</h2>
                 <p className="section-paragraph">Take control of your farm's water consumption today. Stop guessing and start knowing. Join the future of smart farming.</p>
                 <button onClick={() => navigate('/login')} className="cta-button-large">
                    Get Started Now
                </button>
            </section>

            <footer className="footer">
                <div className="footer-container">
                    <p>&copy; {new Date().getFullYear()} HydroFlow Guardian. All Rights Reserved.</p>
                    <div className="footer-links">
                        <a href="#about">About</a>
                        <a href="#features">Features</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}