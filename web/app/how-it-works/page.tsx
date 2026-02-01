"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ClipboardCheck, Shield, MessageSquare, FileText, Package, Video, Check } from "lucide-react"
import { ScrollStep } from "@/components/ScrollStep" // Ensure ScrollStep is imported

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function HowItWorksPage() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-900 z-50">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
            How <span className="text-primary">Adonis</span> Works
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            A clear path to better healthcare.
          </p>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed">
              Through Adonis, the journey to <span className="text-primary font-semibold">optimal performance</span> is powered by{" "}
              <span className="text-primary font-semibold">transformative technology</span> and{" "}
              <span className="text-primary font-semibold">personalized care</span>.
            </p>
          </div>
          <Link href="/get-started">
            <Button className="mt-12 bg-background text-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 h-14 text-base">
              Let's do this
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Scroll Steps */}
      <ScrollStep
        stepNumber={1}
        title="It starts with"
        highlight="your intake"
        description="We get to know your health history, symptoms, and treatment preferences, so we can build your health profile. This information is personalized into your medical record and allows your provider to give you truly individualized care."
        imagePath="/images/how-it-works/intake-seamless.jpg"
        details={[
          "Comprehensive health assessment",
          "Symptom tracking and analysis",
          "Treatment preference consultation"
        ]}
        icon={<ClipboardCheck className="w-10 h-10" />}
      />

      <ScrollStep
        stepNumber={2}
        title="Sent"
        highlight="safely and securely"
        description="A provider reviews your medical information in our HIPAA-compliant platform, which contains multiple security enhancements to protect your privacy."
        imagePath="/images/how-it-works/security-seamless.jpg"
        details={[
          "HIPAA-compliant platform",
          "End-to-end encryption",
          "Multi-layer security protocols"
        ]}
        icon={<Shield className="w-10 h-10" />}
        alternate
      />

      <ScrollStep
        stepNumber={3}
        title="Connect with"
        highlight="a provider"
        description="A medical provider who is licensed in your state reviews your information, messages you with any questions, and if appropriate, recommends a treatment that fits your needs—100% online."
        imagePath="/images/how-it-works/provider-seamless.jpg"
        details={[
          "State-licensed physicians",
          "Real-time messaging",
          "Personalized treatment plans"
        ]}
        icon={<MessageSquare className="w-10 h-10" />}
      />

      <ScrollStep
        stepNumber={4}
        title="A prescription and"
        highlight="a plan"
        description="Based on your individual medical profile, your provider will select a personalized treatment plan that can best help you achieve your optimization goals."
        imagePath="/images/how-it-works/plan-seamless.jpg"
        details={[
          "Hormone optimization protocols",
          "Performance enhancement strategies",
          "Ongoing protocol adjustments"
        ]}
        icon={<FileText className="w-10 h-10" />}
        alternate
      />

      <ScrollStep
        stepNumber={5}
        title="Prescribed, sealed and"
        highlight="delivered"
        description="If prescribed, your treatment is shipped directly to your door in discreet packaging. Free shipping is included with all orders."
        imagePath="/images/how-it-works/delivery-seamless.jpg"
        details={[
          "Direct-to-home delivery",
          "Discreet packaging",
          "Free shipping included"
        ]}
        icon={<Package className="w-10 h-10" />}
      />

      <ScrollStep
        stepNumber={6}
        title="Ongoing"
        highlight="support"
        description="The Adonis patient portal provides streamlined access to your care journey, including secure messaging with your clinical team, guided check-ins, lab result tracking, and personalized progress monitoring—so you stay informed and supported throughout your program."
        imagePath="/images/how-it-works/support-seamless.jpg"
        details={[
          "Secure clinical messaging",
          "Lab result tracking",
          "Personalized progress monitoring"
        ]}
        icon={<Video className="w-10 h-10" />}
        alternate
      />

      {/* Final CTA Section */}
      <section className="relative min-h-screen flex items-center justify-center border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Ready to <span className="text-primary">optimize</span> your health?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Join over 1,200 men who trust Adonis for their performance optimization journey.
          </p>
          <Link href="/get-started">
            <Button className="bg-background text-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground font-semibold px-12 h-16 text-lg">
              Begin Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
