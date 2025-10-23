import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPro.css';

const WaterDropIcon = ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"></path>
    </svg>
);

const ShieldCheckIcon = ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 12 11 14 15 10"></polyline>
    </svg>
);

const ZapIcon = ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

const ActivityIcon = ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
);

const BellIcon = ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const TrendingUpIcon = ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const CheckIcon = ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const StarIcon = ({ className = "" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => {
            if (counterRef.current) {
                observer.unobserve(counterRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            setCount(Math.floor(progress * end));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return <span ref={counterRef}>{count}{suffix}</span>;
};

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
    return (
        <div className="feature-card" style={{ animationDelay: `${delay}ms` }}>
            <div className="feature-card-icon">
                {icon}
            </div>
            <h3 className="feature-card-title">{title}</h3>
            <p className="feature-card-description">{description}</p>
            <div className="feature-card-glow"></div>
        </div>
    );
};

const PricingCard = ({ title, price, features, highlighted = false, delay = 0 }) => {
    const navigate = useNavigate();
    
    return (
        <div className={`pricing-card ${highlighted ? 'pricing-card-highlighted' : ''}`} style={{ animationDelay: `${delay}ms` }}>
            {highlighted && <div className="pricing-badge">Most Popular</div>}
            <h3 className="pricing-title">{title}</h3>
            <div className="pricing-price">
                <span className="pricing-currency">$</span>
                <span className="pricing-amount">{price}</span>
                <span className="pricing-period">/month</span>
            </div>
            <ul className="pricing-features">
                {features.map((feature, index) => (
                    <li key={index} className="pricing-feature">
                        <CheckIcon className="pricing-check" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button 
                onClick={() => navigate('/signup')} 
                className={`pricing-button ${highlighted ? 'pricing-button-highlighted' : ''}`}
            >
                Get Started
            </button>
        </div>
    );
};

const TestimonialCard = ({ quote, author, role, rating, delay = 0 }) => {
    return (
        <div className="testimonial-card" style={{ animationDelay: `${delay}ms` }}>
            <div className="testimonial-rating">
                {[...Array(rating)].map((_, i) => (
                    <StarIcon key={i} className="testimonial-star" />
                ))}
            </div>
            <p className="testimonial-quote">"{quote}"</p>
            <div className="testimonial-author">
                <div className="testimonial-avatar">{author.charAt(0)}</div>
                <div className="testimonial-info">
                    <div className="testimonial-name">{author}</div>
                    <div className="testimonial-role">{role}</div>
                </div>
            </div>
        </div>
    );
};

export default function LandingPro() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="landing-pro">
            <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="nav-logo">
                        <WaterDropIcon className="nav-logo-icon" />
                        <span>HydroFlow</span>
                    </div>
                    <div className="nav-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How It Works</a>
                        <a href="#testimonials">Testimonials</a>
                    </div>
                    <div className="nav-actions">
                        <button onClick={() => navigate('/login')} className="nav-button nav-button-secondary">
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                    <div className="hero-grid"></div>
                    <div className="hero-orb hero-orb-1"></div>
                    <div className="hero-orb hero-orb-2"></div>
                    <div className="hero-orb hero-orb-3"></div>
                </div>
                
                <div className="hero-content">
                    
                    <h1 className="hero-title">
                        Protect Your Farm's<br />
                        <span className="hero-title-gradient">Most Valuable Resource</span>
                    </h1>
                    
                    <p className="hero-subtitle">
                        AI-powered water monitoring that detects leaks instantly, prevents waste automatically,
                        and saves you thousands. Join 500+ farms already protecting their water supply.
                    </p>
                    
                    <div className="hero-actions">
                        <button onClick={() => navigate('/signup')} className="hero-button hero-button-primary">
                            Save Water Now!
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-number">
                                <AnimatedCounter end={500} suffix="+" />
                            </div>
                            <div className="hero-stat-label">Active Farms</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">
                                <AnimatedCounter end={50} suffix="M" />
                            </div>
                            <div className="hero-stat-label">Liters Saved</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">
                                <AnimatedCounter end={99} suffix=".9%" />
                            </div>
                            <div className="hero-stat-label">Uptime</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">
                                <AnimatedCounter end={24} suffix="/7" />
                            </div>
                            <div className="hero-stat-label">Monitoring</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="section features-section animate-on-scroll">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Features</span>
                        <h2 className="section-title">Everything You Need to<br />Protect Your Water Supply</h2>
                        <p className="section-subtitle">
                            Powerful features designed specifically for modern poultry farms
                        </p>
                    </div>
                    
                    <div className="features-grid">
                        <FeatureCard
                            icon={<ActivityIcon className="feature-icon" />}
                            title="Real-Time Monitoring"
                            description="Track water flow with millisecond precision. Get instant insights into consumption patterns and anomalies."
                            delay={0}
                        />
                        <FeatureCard
                            icon={<ZapIcon className="feature-icon" />}
                            title="Auto Shut-Off"
                            description="Smart valves automatically close when leaks are detected, preventing catastrophic water loss."
                            delay={200}
                        />
                        <FeatureCard
                            icon={<BellIcon className="feature-icon" />}
                            title="Instant Alerts"
                            description="Receive immediate notifications via email, SMS, or mobile app when issues are detected."
                            delay={300}
                        />
                        <FeatureCard
                            icon={<TrendingUpIcon className="feature-icon" />}
                            title="Analytics Dashboard"
                            description="Beautiful, intuitive dashboard with detailed reports and actionable insights."
                            delay={400}
                        />
                        <FeatureCard
                            icon={<WaterDropIcon className="feature-icon" />}
                            title="Water Conservation"
                            description="Reduce water waste by up to 40% with intelligent monitoring and automated controls."
                            delay={500}
                        />
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="section how-it-works-section section-dark animate-on-scroll">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">How It Works</span>
                        <h2 className="section-title">Simple Setup,<br />Powerful Protection</h2>
                        <p className="section-subtitle">
                            Get up and running in minutes with our easy 4-step process
                        </p>
                    </div>
                    
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">01</div>
                            <div className="step-content">
                                <h3 className="step-title">Install Sensors</h3>
                                <p className="step-description">
                                    Our team installs high-precision flow sensors in your existing pipeline system. No major modifications needed.
                                </p>
                            </div>
                            <div className="step-line"></div>
                        </div>
                        
                        <div className="step">
                            <div className="step-number">02</div>
                            <div className="step-content">
                                <h3 className="step-title">Connect & Configure</h3>
                                <p className="step-description">
                                    Connect to your WiFi, set your schedules, and customize alert preferences through our intuitive dashboard.
                                </p>
                            </div>
                            <div className="step-line"></div>
                        </div>
                        
                        <div className="step">
                            <div className="step-number">03</div>
                            <div className="step-content">
                                <h3 className="step-title">Relax & Save</h3>
                                <p className="step-description">
                                    Sit back while HydroFlow monitors 24/7, automatically prevents leaks, and saves you money every single day.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="pricing" className="section free-platform-section animate-on-scroll">
                <div className="container">
                    <div className="free-platform-content">
                        <div className="free-badge">100% FREE</div>
                        <h2 className="section-title">Completely Free to Use</h2>
                        <p className="section-subtitle">
                            No hidden costs, no subscriptions, no credit card required.<br/>
                            Full access to all features, forever.
                        </p>
                        <div className="free-features">
                            <div className="free-feature">
                                <CheckIcon className="free-check" />
                                <span>Unlimited monitoring points</span>
                            </div>
                            <div className="free-feature">
                                <CheckIcon className="free-check" />
                                <span>Real-time dashboard & analytics</span>
                            </div>
                            <div className="free-feature">
                                <CheckIcon className="free-check" />
                                <span>Email & SMS alerts</span>
                            </div>
                            <div className="free-feature">
                                <CheckIcon className="free-check" />
                                <span>Auto shut-off valves</span>
                            </div>
                            <div className="free-feature">
                                <CheckIcon className="free-check" />
                                <span>24/7 monitoring & support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="testimonials" className="section testimonials-section section-dark animate-on-scroll">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Testimonials</span>
                        <h2 className="section-title">Loved by Farm Owners</h2>
                        <p className="section-subtitle">
                            See what our customers have to say
                        </p>
                    </div>
                    
                    <div className="testimonials-grid">
                        <TestimonialCard
                            quote="I am currently using this Hydro-FlowGauge service and it is working great inn our Poultry farm."
                            author="Sabeel Mohamed M"
                            role="Farm Owner, Coimbatore"
                            rating={5}
                            delay={0}
                        />
                        <TestimonialCard
                            quote="I have lost many time by cleaning the wet floor of poultry farm., but now i am free from this problem by the help of the Hydro-FlowGauge."
                            author="Sudharsanprakalathan VM"
                            role="Poultry manager, Pollachi"
                            rating={5}
                            delay={100}
                        />
                        <TestimonialCard
                            quote="As i am using the Hydro-FlowGauge application, i am able to monitor the water usage of my poultry farm."
                            author="Kaarthik S"
                            role="Poultry Farmer, Thirupur"
                            rating={5}
                            delay={200}
                        />
                    </div>
                </div>
            </section>

            <section className="section cta-section animate-on-scroll">
                <div className="cta-container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Stop Wasting Water?</h2>
                        <p className="cta-subtitle">
                            Join 500+ farms protecting their water supply with HydroFlow Guardian
                        </p>
                        <div className="cta-actions">
                            <button onClick={() => navigate('/signup')} className="cta-button cta-button-primary">
                                Save Water Now!
                            </button>
                            <button onClick={() => navigate('/login')} className="cta-button cta-button-secondary">
                                View Dashboard
                            </button>
                        </div>
                        <p className="cta-note">100% Free • No credit card required • Full access to all features</p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-simple">
                    <div className="footer-logo">
                        <WaterDropIcon className="footer-logo-icon" />
                        <span>HydroFlow Guardian</span>
                    </div>
                    <p className="footer-text">
                        &copy; {new Date().getFullYear()} HydroFlow Guardian. Smart water monitoring for modern farms.
                    </p>
                </div>
            </footer>
        </div>
    );
}
