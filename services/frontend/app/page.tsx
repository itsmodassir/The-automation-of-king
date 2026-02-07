import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import TrustStrip from "./components/landing/TrustStrip";
import Problem from "./components/landing/Problem";
import Solution from "./components/landing/Solution";
import Features from "./components/landing/Features";
import Comparison from "./components/landing/Comparison";
import UseCases from "./components/landing/UseCases";
import SocialProof from "./components/landing/SocialProof";
import Pricing from "./components/landing/Pricing";
import CTA from "./components/landing/CTA";
import Footer from "./components/landing/Footer";

export default function HomePage() {
    return (
        <main className="font-sans antialiased text-gray-900">
            <Navbar />
            <Hero />
            <TrustStrip />
            <Problem />
            <Solution />
            <Features />
            <Comparison />
            <UseCases />
            <SocialProof />
            <Pricing />
            <CTA />
            <Footer />
        </main>
    );
}
