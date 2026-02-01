import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Syringe, Brain, Heart, TrendingUp, Users, Clock, ClipboardCheck, MessageSquare, FileText, Package, Video, Shield } from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            {/* Hero Section */}
            <section className="border-b border-border">
                <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
                        Experience the power of
                        <span className="block text-primary mt-2">peak performance.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        How you feel in your body and mind transforms how you show up in life. Best-in-class care means normalizing challenges and offering a healthcare experience with innovative solutions designed for each individual patient.
                    </p>
                </div>
            </section>

            {/* Personal Care Section */}
            <section className="border-b border-border bg-zinc-950">
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8">
                            Your health is <span className="text-primary">personal</span>. Now, so is your care.
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Adonis is built at the intersection of clinical expertise and intelligent technology. Care may be delivered through asynchronous or live workflows, with licensed medical providers reviewing your health data, history, and goals to determine appropriate next steps. Our patient-centric dashboard leverages advanced data analysis to integrate labs, track progress, and surface clinically relevant patterns, supporting a more precise, adaptive approach to care.
                        </p>
                    </div>
                </div>
            </section>

            {/* Treatment Categories Grid */}
            <section className="border-b border-border">
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border border-primary flex items-center justify-center">
                                <Syringe className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Hormone Optimization</h3>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border border-primary flex items-center justify-center">
                                <TrendingUp className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Performance Enhancement</h3>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border border-primary flex items-center justify-center">
                                <Brain className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Cognitive Function</h3>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border border-primary flex items-center justify-center">
                                <Heart className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Metabolic Health</h3>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border border-primary flex items-center justify-center">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Sexual Wellness</h3>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border border-primary flex items-center justify-center">
                                <Clock className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Longevity Medicine</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="border-b border-border bg-zinc-950">
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                            Success is the <span className="text-primary">standard</span>.
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                            When it comes to your results, we're obsessed. It's why we work so hard to deliver the simplest process, access to the most innovative treatment plans, and the best experience possible for each and every patient—all <span className="text-primary font-semibold">1,200+</span> of you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="border-b border-border">
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Testimonial 1 */}
                        <div className="border border-border p-8 bg-zinc-950">
                            <div className="mb-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-5 h-5 border border-primary" />
                                    ))}
                                </div>
                                <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed mb-6">
                                    "Out of 5 stars, I'd give Adonis 6. The care team is responsive, the protocols actually work, and I feel better than I have in 10 years."
                                </p>
                            </div>
                            <div className="border-t border-border pt-4">
                                <p className="text-sm font-semibold text-primary">Marcus, 42</p>
                                <p className="text-xs text-muted-foreground">Real Adonis Patient</p>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="border border-border p-8 bg-zinc-950">
                            <div className="mb-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-5 h-5 border border-primary" />
                                    ))}
                                </div>
                                <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed mb-6">
                                    "Adonis has changed my life for the better. More energy, better sleep, improved focus—everything I wanted from optimization."
                                </p>
                            </div>
                            <div className="border-t border-border pt-4">
                                <p className="text-sm font-semibold text-primary">David, 38</p>
                                <p className="text-xs text-muted-foreground">Real Adonis Patient</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="border-b border-border">
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <div className="text-center">
                            <p className="text-5xl md:text-6xl font-bold text-primary mb-3">1,200+</p>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Patients</p>
                        </div>
                        <div className="text-center">
                            <p className="text-5xl md:text-6xl font-bold text-primary mb-3">24/7</p>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Care Team Support</p>
                        </div>
                        <div className="text-center">
                            <p className="text-5xl md:text-6xl font-bold text-primary mb-3">48hr</p>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Lab Result Review</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="bg-zinc-950 border-b border-border">
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Founders</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Built by entrepreneurs who understand the demands of peak performance
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="border border-border mb-6 overflow-hidden aspect-square">
                                    <img
                                        src="/images/team/founder-1.jpg"
                                        alt="Michael Thompson"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-1">Michael Thompson</h3>
                                <p className="text-sm text-primary font-medium mb-3 uppercase tracking-wider">Co-Founder & CEO</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Former tech executive who transformed his own health through optimization protocols. 15+ years building scalable healthcare platforms.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="border border-border mb-6 overflow-hidden aspect-square">
                                    <img
                                        src="/images/team/founder-2.jpg"
                                        alt="David Chen"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-1">David Chen</h3>
                                <p className="text-sm text-primary font-medium mb-3 uppercase tracking-wider">Co-Founder & CTO</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Serial entrepreneur with background in precision medicine. Built data infrastructure for personalized treatment protocols at scale.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Board of Advisors Section */}
            <section className="border-b border-border">
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Board of Advisors</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Leading physicians and researchers in hormone optimization and performance medicine
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="text-center">
                                <div className="border border-border mb-6 overflow-hidden aspect-square">
                                    <img
                                        src="/images/team/advisor-1.jpg"
                                        alt="Dr. Robert Martinez"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-1">Dr. Robert Martinez, MD</h3>
                                <p className="text-xs text-primary font-medium mb-3 uppercase tracking-wider">Medical Director</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Board-certified endocrinologist with 20+ years specializing in male hormone optimization and metabolic health.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="border border-border mb-6 overflow-hidden aspect-square">
                                    <img
                                        src="/images/team/advisor-2.jpg"
                                        alt="Dr. Sarah Williams"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-1">Dr. Sarah Williams, MD</h3>
                                <p className="text-xs text-primary font-medium mb-3 uppercase tracking-wider">Clinical Advisor</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Sports medicine physician and performance optimization expert. Former team physician for professional athletes.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="border border-border mb-6 overflow-hidden aspect-square">
                                    <img
                                        src="/images/team/advisor-3.jpg"
                                        alt="Dr. James Anderson"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-1">Dr. James Anderson, PhD</h3>
                                <p className="text-xs text-primary font-medium mb-3 uppercase tracking-wider">Scientific Advisor</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Leading researcher in hormonal therapeutics and longevity medicine. Published 50+ peer-reviewed studies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-zinc-950">
                <div className="container mx-auto px-4 py-20 md:py-32">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                            Ready to unlock your <span className="text-primary">potential</span>?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Start your health assessment today and speak with a physician within 48 hours.
                        </p>
                        <Link href="/get-started">
                            <Button size="lg" className="bg-background text-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground h-14 px-12 text-base font-semibold">
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
