"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, User } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [treatmentsOpen, setTreatmentsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const treatments = [
    "Testosterone Replacement Therapy",
    "Testosterone Boosters",
    "Sexual Wellness",
    "Hair Loss Prevention",
    "Peptide Therapy",
    "Nutrient Therapy",
    "Longevity & Anti-Aging",
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? "bg-background/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          <Link href="/" className="flex items-center">
            <Image
              src="/adonis-logo.png"
              alt="ADONIS"
              width={184}
              height={51}
              className="h-9 sm:h-11 lg:h-[51px] w-auto"
              priority
            />
          </Link>

          <div className="hidden items-center gap-6 xl:gap-10 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setTreatmentsOpen(true)}
              onMouseLeave={() => setTreatmentsOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors">
                Treatments
                <ChevronDown className="h-4 w-4" />
              </button>

              {treatmentsOpen && (
                <div className="absolute top-full left-0 pt-4 w-72">
                  <div className="bg-black border border-primary/30">
                    {treatments.map((treatment, index) => (
                      <Link
                        key={treatment}
                        href={`/treatments/${treatment.toLowerCase().replace(/\s+/g, "-")}`}
                        className={`block px-6 py-4 border-b border-border last:border-b-0 transition-colors ${
                          index === 0
                            ? "text-primary bg-primary/5"
                            : "text-foreground hover:text-primary hover:bg-primary/5"
                        }`}
                      >
                        {treatment}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {["Goals", "How it Works", "About Us", "FAQ", "Blog"].map((item) => (
              <Link
                key={item}
                href={item === "About Us" ? "/about" : `/${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-sm lg:text-base text-foreground hover:text-primary hover:bg-transparent gap-2"
              >
                <User className="h-4 w-4" />
                Patient Login
              </Button>
            </Link>
            <Link href="/get-started">
              <Button className="bg-primary text-background hover:bg-primary/90 text-sm lg:text-base h-10 lg:h-11 px-4 lg:px-6 font-semibold">
                Get Started
              </Button>
            </Link>
          </div>

          <button className="lg:hidden text-foreground p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 sm:top-20 bg-background lg:hidden overflow-y-auto">
            <div className="flex flex-col p-4 sm:p-6">
              <div className="py-4 border-b border-border">
                <button
                  onClick={() => setTreatmentsOpen(!treatmentsOpen)}
                  className="flex items-center justify-between w-full text-foreground text-lg"
                >
                  Treatments
                  <ChevronDown className={`h-5 w-5 transition-transform ${treatmentsOpen ? "rotate-180" : ""}`} />
                </button>
                {treatmentsOpen && (
                  <div className="mt-4 pl-4 space-y-3">
                    {treatments.map((treatment) => (
                      <Link
                        key={treatment}
                        href={`/treatments/${treatment.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block py-2 text-muted-foreground hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {treatment}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {["Goals", "How it Works", "About Us", "FAQ", "Blog"].map((item) => (
                <Link
                  key={item}
                  href={item === "About Us" ? "/about" : `/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-foreground text-lg py-4 border-b border-border"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}

              <div className="flex flex-col gap-4 pt-8">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-12 justify-center gap-2 text-base bg-transparent">
                    <User className="h-5 w-5" />
                    Patient Login
                  </Button>
                </Link>
                <Link href="/get-started" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-12 bg-primary text-background font-semibold text-base">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-b border-border" />
    </header>
  )
}
